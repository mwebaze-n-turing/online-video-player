// src/components/video/Controls/ThumbnailPreview.tsx - Alternative implementation
import { useEffect, useState, useRef } from 'react';

interface ThumbnailPreviewProps {
  video: HTMLVideoElement | null;
  previewTime: number;
  position: number;
  total: number;
  containerRef: React.RefObject<HTMLDivElement>;
  // For sprite sheet option
  spriteSheet?: {
    url: string;
    width: number;
    height: number;
    interval: number; // Time interval between thumbnails in seconds
    columns: number; // Number of columns in the sprite grid
  };
}

export const ThumbnailPreview = ({ 
  video, 
  previewTime, 
  position, 
  total,
  containerRef,
  spriteSheet
}: ThumbnailPreviewProps) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [backgroundPosition, setBackgroundPosition] = useState('0 0');
  const previewRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewPosition, setPreviewPosition] = useState(position);
  const [useCanvas, setUseCanvas] = useState(!spriteSheet);

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

  // When using sprite sheets
  useEffect(() => {
    if (!spriteSheet || !isFinite(previewTime)) return;
    
    setUseCanvas(false);
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

  // Generate thumbnail from video at specific time point (when not using sprite sheets)
  useEffect(() => {
    if (!useCanvas || !video || !canvasRef.current || !isFinite(previewTime)) return;
    
    setLoading(true);
    
    // Store current video state to restore afterward
    const originalCurrentTime = video.currentTime;
    const wasPlaying = !video.paused;
    
    // Pause the video while we capture the thumbnail
    if (wasPlaying) video.pause();
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Capture the frame at the preview time
    const captureFrame = () => {
      // Set canvas dimensions to match video ratio
      const aspectRatio = video.videoWidth / video.videoHeight;
      canvas.width = 160; // Fixed width for preview
      canvas.height = canvas.width / aspectRatio;
      
      // Draw the video frame to the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to URL
      try {
        const url = canvas.toDataURL('image/jpeg');
        setThumbnailUrl(url);
        setLoading(false);
      } catch (e) {
        console.error('Error generating thumbnail:', e);
      }
      
      // Restore video state
      video.currentTime = originalCurrentTime;
      if (wasPlaying) video.play();
    };
    
    // Set the video to the preview time and wait for it to update
    video.currentTime = previewTime;
    
    const handleSeeked = () => {
      captureFrame();
      video.removeEventListener('seeked', handleSeeked);
    };
    
    video.addEventListener('seeked', handleSeeked);
    
    return () => {
      video.removeEventListener('seeked', handleSeeked);
      // Ensure we restore video state if component unmounts
      video.currentTime = originalCurrentTime;
      if (wasPlaying) video.play();
    };
  }, [video, previewTime, useCanvas]);
  
  // Adjust preview position to ensure it stays within player boundaries
  useEffect(() => {
    if (!previewRef.current || !containerRef.current) {
      setPreviewPosition(position);
      return;
    }
    
    const previewWidth = previewRef.current.offsetWidth;
    const containerWidth = containerRef.current.offsetWidth;
    const halfPreviewWidth = previewWidth / 2;
    
    // Calculate left and right boundaries
    let adjustedPosition = position;
    
    // Prevent preview from going off left edge
    if (position - halfPreviewWidth < 0) {
      adjustedPosition = halfPreviewWidth;
    }
    // Prevent preview from going off right edge
    else if (position + halfPreviewWidth > containerWidth) {
      adjustedPosition = containerWidth - halfPreviewWidth;
    }
    
    setPreviewPosition(adjustedPosition);
  }, [position, containerRef]);

  return (
    <div>
      {/* Hidden canvas for thumbnail generation */}
      {useCanvas && <canvas ref={canvasRef} className="hidden" />}

      {/* Thumbnail display */}
      <div 
        className="w-40 h-24 bg-gray-800 flex items-center justify-center"
        style={spriteSheet ? {
          backgroundImage: `url(${spriteSheet.url})`,
          backgroundPosition,
          backgroundSize: 'auto',
          width: `${spriteSheet.width}px`,
          height: `${spriteSheet.height}px`,
        } : {}}
      >
        {useCanvas ? (
          thumbnailUrl ? (
            <img src={thumbnailUrl} alt={`Preview at ${formatTime(previewTime)}`} className="w-full h-full object-contain" />
          ) : (
            <div className="text-white text-opacity-50 text-xs">Loading...</div>
          )
        ) : null}
      </div>
      
      {/* Timestamp */}
      <div className="text-center text-white text-sm mt-2">
        {formatTime(previewTime)}
      </div>
    </div>
  );
};