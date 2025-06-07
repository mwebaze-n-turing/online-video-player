// src/components/video/Controls/OptimizedThumbnailPreview.tsx
import { useEffect, useState, useRef } from 'react';
import { captureThumbnail, ThumbnailCache } from '@/lib/video/clientThumbnailGenerator';

// Create a global thumbnail cache
const thumbnailCache = new ThumbnailCache(30);

interface OptimizedThumbnailPreviewProps {
  video: HTMLVideoElement | null;
  previewTime: number;
  position: number;
  total: number;
  containerRef: React.RefObject<HTMLDivElement>;
  spriteSheet?: {
    url: string;
    width: number;
    height: number;
    interval: number;
    columns: number;
  };
}

export const OptimizedThumbnailPreview = ({
  video,
  previewTime,
  position,
  total,
  containerRef,
  spriteSheet
}: OptimizedThumbnailPreviewProps) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [backgroundPosition, setBackgroundPosition] = useState('0 0');
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewPosition, setPreviewPosition] = useState(position);
  const [useSprite, setUseSprite] = useState(!!spriteSheet);
  
  // Round to nearest half second to reduce number of generated thumbnails
  const roundedTime = Math.round(previewTime * 2) / 2;
  const cacheKey = `thumb-${roundedTime}`;

  // Format time for display
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

  // Handle sprite sheet option
  useEffect(() => {
    if (!spriteSheet || !isFinite(previewTime)) return;
    
    setUseSprite(true);
    setLoading(false);
    
    // Calculate which frame in the sprite sheet to show
    const frameNumber = Math.floor(previewTime / spriteSheet.interval);
    const column = frameNumber % spriteSheet.columns;
    const row = Math.floor(frameNumber / spriteSheet.columns);
    
    // Calculate background position for sprite
    const xPos = -(column * spriteSheet.width);
    const yPos = -(row * spriteSheet.height);
    
    setBackgroundPosition(`${xPos}px ${yPos}px`);
  }, [previewTime, spriteSheet]);

  // Generate or retrieve thumbnail when not using sprite sheets
  useEffect(() => {
    if (useSprite || !video || !isFinite(roundedTime)) return;
    
    // Check if we have this thumbnail in cache
    if (thumbnailCache.has(cacheKey)) {
      setThumbnailUrl(thumbnailCache.get(cacheKey)!);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    // Debounce thumbnail generation to avoid excessive seeking
    const timeoutId = setTimeout(async () => {
      try {
        const thumbnailDataUrl = await captureThumbnail(video, roundedTime, {
          width: 160,
          quality: 0.75
        });
        
        setThumbnailUrl(thumbnailDataUrl);
        thumbnailCache.set(cacheKey, thumbnailDataUrl);
        setLoading(false);
      } catch (error) {
        console.error('Error generating thumbnail:', error);
        setLoading(false);
      }
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [video, roundedTime, cacheKey, useSprite]);
  
  // Adjust preview position to stay within boundaries
  useEffect(() => {
    if (!previewRef.current || !containerRef.current) {
      setPreviewPosition(position);
      return;
    }
    
    const previewWidth = previewRef.current.offsetWidth;
    const containerWidth = containerRef.current.offsetWidth;
    const halfPreviewWidth = previewWidth / 2;
    
    // Calculate boundaries
    let adjustedPosition = position;
    
    // Prevent going off left edge
    if (position - halfPreviewWidth < 0) {
      adjustedPosition = halfPreviewWidth;
    }
    // Prevent going off right edge
    else if (position + halfPreviewWidth > containerWidth) {
      adjustedPosition = containerWidth - halfPreviewWidth;
    }
    
    setPreviewPosition(adjustedPosition);
  }, [position, containerRef]);

  return (
    <div ref={previewRef}>
      {/* Thumbnail display */}
      <div 
        className="flex items-center justify-center bg-gray-800"
        style={useSprite ? {
          backgroundImage: `url(${spriteSheet!.url})`,
          backgroundPosition,
          width: `${spriteSheet!.width}px`,
          height: `${spriteSheet!.height}px`,
        } : { width: '160px', height: '90px' }}
      >
        {!useSprite && (
          loading ? (
            <div className="text-white text-opacity-50 text-xs">Loading...</div>
          ) : (
            <img
              src={thumbnailUrl}
              alt={`Preview at ${formatTime(previewTime)}`}
              className="w-full h-full object-contain"
            />
          )
        )}
      </div>
      
      {/* Timestamp */}
      <div className="text-center text-white text-sm mt-2">
        {formatTime(previewTime)}
      </div>
    </div>
  );
};