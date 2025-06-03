// src/hooks/useVideoLoading.ts
import { useState, useEffect, useRef, RefObject } from 'react';

interface UseVideoLoadingOptions {
  autoReset?: boolean;
  resetTimeout?: number;
}

interface UseVideoLoadingReturn {
  isLoading: boolean;
  isMetadataLoaded: boolean;
  isPlaybackReady: boolean;
  progress: number;
  error: Error | null;
  setLoading: (loading: boolean) => void;
  resetLoadingState: () => void;
}

/**
 * Hook to track video loading states
 */
export function useVideoLoading(videoRef: RefObject<HTMLVideoElement>, options: UseVideoLoadingOptions = {}): UseVideoLoadingReturn {
  const { autoReset = true, resetTimeout = 5000 } = options;

  const [isLoading, setIsLoading] = useState(true);
  const [isMetadataLoaded, setIsMetadataLoaded] = useState(false);
  const [isPlaybackReady, setIsPlaybackReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetLoadingState = () => {
    setIsLoading(true);
    setIsMetadataLoaded(false);
    setIsPlaybackReady(false);
    setProgress(0);
    setError(null);
  };

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);

    // If setting to not loading, ensure other states are updated accordingly
    if (!loading) {
      setIsMetadataLoaded(true);
      setIsPlaybackReady(true);
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleProgress = () => {
      if (videoElement.buffered.length > 0) {
        const bufferedEnd = videoElement.buffered.end(0);
        const duration = videoElement.duration;
        const progressPercent = (bufferedEnd / duration) * 100;
        setProgress(progressPercent);

        // If we've buffered enough, mark as ready
        if (progressPercent >= 15) {
          setIsPlaybackReady(true);
        }
      }
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setIsMetadataLoaded(false);
      setIsPlaybackReady(false);
      setProgress(0);
    };

    const handleLoadMetadata = () => {
      setIsMetadataLoaded(true);
    };

    const handleCanPlay = () => {
      setIsPlaybackReady(true);

      if (autoReset) {
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Set a timeout to clear the loading state
        timeoutRef.current = setTimeout(() => {
          setIsLoading(false);
        }, resetTimeout);
      }
    };

    const handleLoadedData = () => {
      setIsPlaybackReady(true);
    };

    const handleError = (e: ErrorEvent) => {
      setError(new Error(`Video loading error: ${e.message}`));
      setIsLoading(false);
    };

    // Add event listeners
    videoElement.addEventListener('loadstart', handleLoadStart);
    videoElement.addEventListener('loadedmetadata', handleLoadMetadata);
    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('loadeddata', handleLoadedData);
    videoElement.addEventListener('progress', handleProgress);
    videoElement.addEventListener('error', handleError as EventListener);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      videoElement.removeEventListener('loadstart', handleLoadStart);
      videoElement.removeEventListener('loadedmetadata', handleLoadMetadata);
      videoElement.removeEventListener('canplay', handleCanPlay);
      videoElement.removeEventListener('loadeddata', handleLoadedData);
      videoElement.removeEventListener('progress', handleProgress);
      videoElement.removeEventListener('error', handleError as EventListener);
    };
  }, [videoRef, autoReset, resetTimeout]);

  return {
    isLoading,
    isMetadataLoaded,
    isPlaybackReady,
    progress,
    error,
    setLoading,
    resetLoadingState,
  };
}

export default useVideoLoading;
