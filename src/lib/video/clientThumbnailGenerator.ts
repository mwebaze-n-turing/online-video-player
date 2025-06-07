// src/lib/video/clientThumbnailGenerator.ts
/**
 * Utility for generating thumbnails on the client side
 */

interface ThumbnailOptions {
  width?: number;
  height?: number;
  quality?: number;
}

/**
 * Captures a thumbnail at the specified time from a video element
 * @returns Promise that resolves to thumbnail data URL
 */
export async function captureThumbnail(
  video: HTMLVideoElement,
  timeInSeconds: number,
  options: ThumbnailOptions = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Store original state
    const originalCurrentTime = video.currentTime;
    const wasPlaying = !video.paused;
    
    // Pause video to capture frame
    if (wasPlaying) video.pause();
    
    // Create canvas for thumbnail
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      // Restore video state
      video.currentTime = originalCurrentTime;
      if (wasPlaying) video.play();
      
      return reject(new Error('Could not get canvas context'));
    }
    
    // Setup dimensions
    const { width = 160, height, quality = 0.8 } = options;
    const aspectRatio = video.videoWidth / video.videoHeight;
    
    canvas.width = width;
    canvas.height = height || Math.round(width / aspectRatio);
    
    // Listen for the seeked event to capture the frame
    const handleSeeked = () => {
      // Draw frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      
      // Restore video state
      video.currentTime = originalCurrentTime;
      if (wasPlaying) video.play();
      
      video.removeEventListener('seeked', handleSeeked);
      resolve(dataUrl);
    };
    
    // Handle errors
    const handleError = (e: Event) => {
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('error', handleError);
      
      // Restore video state
      video.currentTime = originalCurrentTime;
      if (wasPlaying) video.play();
      
      reject(new Error('Error seeking video'));
    };
    
    // Add event listeners
    video.addEventListener('seeked', handleSeeked, { once: true });
    video.addEventListener('error', handleError, { once: true });
    
    // Set to desired time
    video.currentTime = timeInSeconds;
  });
}

/**
 * Creates an in-memory cache for thumbnails to avoid regenerating them
 */
export class ThumbnailCache {
  private cache: Map<string, string> = new Map();
  private maxSize: number;
  
  constructor(maxSize = 20) {
    this.maxSize = maxSize;
  }
  
  has(key: string): boolean {
    return this.cache.has(key);
  }
  
  get(key: string): string | undefined {
    const value = this.cache.get(key);
    if (value) {
      // Move item to the end of the cache (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }
  
  set(key: string, value: string): void {
    // If cache is full, remove oldest entry (first item in the map)
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, value);
  }
  
  clear(): void {
    this.cache.clear();
  }
}