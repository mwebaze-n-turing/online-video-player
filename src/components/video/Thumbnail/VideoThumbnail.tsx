import React from 'react';
import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface VideoThumbnailProps {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: number; // in seconds
  views?: number;
  uploadDate?: string;
  width?: number;
  height?: number;
  className?: string;
}

export const VideoThumbnail: FC<VideoThumbnailProps> = ({
  id,
  title,
  thumbnailUrl,
  duration,
  views,
  uploadDate,
  width = 320,
  height = 180,
  className = '',
}) => {
  // Format duration to MM:SS or HH:MM:SS
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Format view count (e.g., 1.2K, 3.5M)
  const formatViewCount = (count?: number): string => {
    if (!count) return '';
    
    if (count >= 1e9) {
      return (count / 1e9).toFixed(1) + 'B';
    }
    if (count >= 1e6) {
      return (count / 1e6).toFixed(1) + 'M';
    }
    if (count >= 1e3) {
      return (count / 1e3).toFixed(1) + 'K';
    }
    
    return count.toString();
  };

  // Format date to relative time (e.g., 3 days ago, 2 weeks ago)
  const formatUploadDate = (dateString?: string): string => {
    if (!dateString) return '';
    
    const uploadDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - uploadDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  }
  if (diffDays === 1) {
    return 'Yesterday';
  }
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }
  if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
  }
};

  return (
    <>
      <div className={`video-thumbnail relative group overflow-hidden rounded-lg ${className}`}>
        <Link href={`/videos/${id}`}>
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={thumbnailUrl}
              alt={title}
              width={width}
              height={height}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Duration badge */}
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
              {formatDuration(duration)}
            </div>
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Title and metadata */}
          <div className="mt-2">
            <h3 className="text-base font-medium line-clamp-2">{title}</h3>
            
            {(views !== undefined || uploadDate) && (
              <div className="flex text-sm text-gray-500 mt-1">
                {views !== undefined && (
                  <span>{formatViewCount(views)} views</span>
                )}
                
                {views !== undefined && uploadDate && (
                  <span className="mx-1">•</span>
                )}
                
                {uploadDate && (
                  <span>{formatUploadDate(uploadDate)}</span>
                )}
              </div>
            )}
          </div>
        </Link>
      </div>
    </>
  );
};

export default VideoThumbnail;
