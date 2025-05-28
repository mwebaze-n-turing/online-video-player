// src/hooks/useVideoPlayer.tsx
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { StreamingProvider } from '@/lib/video/streamingProvider';
import { SubtitleManager, SubtitleTrack } from '@/lib/video/subtitleManager';
import { VideoAnalyticsService, VideoMetadata } from '@/services/analytics';

export interface VideoPlayerOptions {
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  poster?: string;
  subtitles?: SubtitleTrack[];
  analyticsMetadata?: Partial<VideoMetadata>;
}

interface VideoPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  bufferedTime: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  playbackRate: number;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
}

export function useVideoPlayer(options: VideoPlayerOptions = {}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const subtitleDisplayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Services
  const streamingProviderRef = useRef<StreamingProvider | null>(null);
  const subtitleManagerRef = useRef<SubtitleManager | null>(null);
  const analyticsServiceRef = useRef<VideoAnalyticsService | null>(null);

  // State for player controls
  const [playerState, setPlayerState] = useState<VideoPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    bufferedTime: 0,
    volume: 1,
    isMuted: options.muted || false,
    isFullscreen: false,
    playbackRate: 1,
    isLoading: true,
    isError: false,
    errorMessage: '',
  });

  // Initialize services when video element is available
  useEffect(() => {
    if (!videoRef.current || !subtitleDisplayRef.current) return;

    // Initialize streaming provider
    streamingProviderRef.current = new StreamingProvider(videoRef.current);

    // Initialize subtitle manager
    subtitleManagerRef.current = new SubtitleManager(videoRef.current, subtitleDisplayRef.current);

    // Add subtitle tracks if provided
    if (options.subtitles) {
      options.subtitles.forEach(track => {
        subtitleManagerRef.current?.addTrack(track);
      });
    }

    // Initialize analytics if metadata is provided
    if (options.analyticsMetadata) {
      const metadata: VideoMetadata = {
        videoId: options.analyticsMetadata.videoId || 'unknown',
        title: options.analyticsMetadata.title || 'Untitled Video',
        playerName: 'nextjs-video-player',
        playerVersion: '1.0.0',
        videoUrl: videoRef.current.src,
        ...options.analyticsMetadata,
      };

      analyticsServiceRef.current = new VideoAnalyticsService(videoRef.current, metadata);
      analyticsServiceRef.current.initialize();
    }

    // Set up event listeners to update state
    const videoElement = videoRef.current;

    const updatePlayerState = () => {
      if (!videoElement) return;

      // Calculate buffered time
      let bufferedTime = 0;
      if (videoElement.buffered.length > 0) {
        bufferedTime = videoElement.buffered.end(videoElement.buffered.length - 1);
      }

      setPlayerState(prev => ({
        ...prev,
        isPlaying: !videoElement.paused,
        currentTime: videoElement.currentTime,
        duration: videoElement.duration || 0,
        bufferedTime,
        volume: videoElement.volume,
        isMuted: videoElement.muted,
        playbackRate: videoElement.playbackRate,
        isLoading: videoElement.readyState < 3, // HAVE_FUTURE_DATA (3) or lower means loading
      }));
    };

    // Event listeners
    videoElement.addEventListener('loadedmetadata', updatePlayerState);
    videoElement.addEventListener('timeupdate', updatePlayerState);
    videoElement.addEventListener('progress', updatePlayerState);
    videoElement.addEventListener('play', updatePlayerState);
    videoElement.addEventListener('pause', updatePlayerState);
    videoElement.addEventListener('volumechange', updatePlayerState);
    videoElement.addEventListener('ratechange', updatePlayerState);
    videoElement.addEventListener('waiting', updatePlayerState);
    videoElement.addEventListener('canplay', updatePlayerState);

    // Error handling
    videoElement.addEventListener('error', () => {
      setPlayerState(prev => ({
        ...prev,
        isError: true,
        errorMessage: 'Error loading video',
        isLoading: false,
      }));
    });

    // Fullscreen change
    const handleFullscreenChange = () => {
      const isFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );

      setPlayerState(prev => ({
        ...prev,
        isFullscreen,
      }));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Clean up
    return () => {
      videoElement.removeEventListener('loadedmetadata', updatePlayerState);
      videoElement.removeEventListener('timeupdate', updatePlayerState);
      videoElement.removeEventListener('progress', updatePlayerState);
      videoElement.removeEventListener('play', updatePlayerState);
      videoElement.removeEventListener('pause', updatePlayerState);
      videoElement.removeEventListener('volumechange', updatePlayerState);
      videoElement.removeEventListener('ratechange', updatePlayerState);
      videoElement.removeEventListener('waiting', updatePlayerState);
      videoElement.removeEventListener('canplay', updatePlayerState);
      videoElement.removeEventListener('error', updatePlayerState);

      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);

      // Dispose services
      streamingProviderRef.current?.destroyInstances();
      analyticsServiceRef.current?.dispose();
    };
  }, [options.analyticsMetadata, options.subtitles, options.muted]);

  // Load video source
  const loadVideo = useCallback((src: string) => {
    if (!videoRef.current || !streamingProviderRef.current) return;

    // Reset player state
    setPlayerState(prev => ({
      ...prev,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      bufferedTime: 0,
      isLoading: true,
      isError: false,
      errorMessage: '',
    }));

    // Set up streaming provider based on source type
    streamingProviderRef.current.setupStreamingFromUrl(src);

    // Update analytics if available
    if (analyticsServiceRef.current) {
      const metadata: VideoMetadata = {
        ...analyticsServiceRef.current['metadata'],
        videoUrl: src,
      };

      // Re-initialize analytics with new source
      analyticsServiceRef.current = new VideoAnalyticsService(videoRef.current!, metadata);
      analyticsServiceRef.current.initialize();
    }
  }, []);

  // Player control methods
  const play = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error('Error playing video:', error);
        setPlayerState(prev => ({
          ...prev,
          isError: true,
          errorMessage: 'Failed to play video. Autoplay may be blocked.',
        }));
      });
    }
  }, []);

  const pause = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (playerState.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [playerState.isPlaying, play, pause]);

  const seek = useCallback(
    (time: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = Math.max(0, Math.min(time, playerState.duration));
      }
    },
    [playerState.duration]
  );

  const setVolume = useCallback((volume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = Math.max(0, Math.min(volume, 1));
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!playerState.isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if ((containerRef.current as any).webkitRequestFullscreen) {
        (containerRef.current as any).webkitRequestFullscreen();
      } else if ((containerRef.current as any).mozRequestFullScreen) {
        (containerRef.current as any).mozRequestFullScreen();
      } else if ((containerRef.current as any).msRequestFullscreen) {
        (containerRef.current as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  }, [playerState.isFullscreen]);

  // Subtitle methods
  const setActiveSubtitle = useCallback((trackId: string | null) => {
    if (!subtitleManagerRef.current) return;

    if (trackId) {
      subtitleManagerRef.current.activateTrack(trackId);
    } else {
      subtitleManagerRef.current.deactivateSubtitles();
    }
  }, []);

  return {
    videoRef,
    containerRef,
    subtitleDisplayRef,
    playerState,
    loadVideo,
    play,
    pause,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    setPlaybackRate,
    toggleFullscreen,
    setActiveSubtitle,
  };
}
