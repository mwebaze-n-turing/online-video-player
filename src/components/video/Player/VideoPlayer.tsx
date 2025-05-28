// src/components/video/Player/VideoPlayer.tsx
'use client';

import React, { useEffect } from 'react';
import { useVideoPlayer, VideoPlayerOptions } from '@/hooks/useVideoPlayer';
import { SubtitleTrack } from '@/lib/video/subtitleManager';

interface VideoPlayerProps {
  src: string;
  posterSrc?: string;
  title?: string;
  subtitles?: SubtitleTrack[];
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
  onPlaybackStarted?: () => void;
  onPlaybackEnded?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  posterSrc,
  title,
  subtitles,
  autoplay = false,
  muted = false,
  loop = false,
  className = '',
  onPlaybackStarted,
  onPlaybackEnded,
}) => {
  const options: VideoPlayerOptions = {
    autoplay,
    muted,
    loop,
    poster: posterSrc,
    subtitles,
    analyticsMetadata: {
      videoId: src.split('/').pop()?.split('.')[0] || 'unknown',
      title: title || 'Video',
    },
  };

  const {
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
    toggleFullscreen,
  } = useVideoPlayer(options);

  // Load video when src changes
  useEffect(() => {
    loadVideo(src);
  }, [src, loadVideo]);

  // Handle callbacks
  useEffect(() => {
    if (playerState.isPlaying && onPlaybackStarted) {
      onPlaybackStarted();
    }

    if (playerState.currentTime >= playerState.duration && playerState.duration > 0 && onPlaybackEnded) {
      onPlaybackEnded();
    }
  }, [playerState.isPlaying, playerState.currentTime, playerState.duration, onPlaybackStarted, onPlaybackEnded]);

  return (
    <div>
      {/* Video element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        preload="auto"
        poster={posterSrc}
        autoPlay={autoplay}
        muted={muted}
        loop={loop}
        playsInline
      />

      {/* Subtitle display */}
      <div ref={subtitleDisplayRef} className="absolute bottom-16 left-0 right-0 text-center text-white text-xl subtitle-container" />

      {/* Player controls overlay - using our Tailwind utility classes */}
      <div
        className={`player-controls-container control-visibility-group ${
          playerState.isPlaying && !playerState.isError ? 'control-fade-in' : 'opacity-100'
        }`}
      >
        {/* Custom controls would go here using our Player Controls components */}
        {/* This is a simple example */}
        <div className="player-timeline">
          <div className="player-timeline-progress" style={{ width: `${(playerState.currentTime / playerState.duration) * 100}%` }} />
          <div className="player-timeline-buffered" style={{ width: `${(playerState.bufferedTime / playerState.duration) * 100}%` }} />
          <div className="player-timeline-thumb" style={{ left: `${(playerState.currentTime / playerState.duration) * 100}%` }} />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <button>
              {playerState.isPlaying ? (
                <svg>
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg>
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button>
              {playerState.isMuted ? (
                <svg>
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : (
                <svg>
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              )}
            </button>
            <div className="text-white text-sm">
              {formatTime(playerState.currentTime)} / {formatTime(playerState.duration)}
            </div>
          </div>
          <div>
            <button>
              {playerState.isFullscreen ? (
                <svg>
                  <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                </svg>
              ) : (
                <svg>
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading spinner */}
      {playerState.isLoading && (
        <div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-player-control-active"></div>
        </div>
      )}

      {/* Error message */}
      {playerState.isError && (
        <div>
          <svg>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3>Playback Error</h3>
          <p>{playerState.errorMessage || 'Failed to load video'}</p>
          <button onClick={() => loadVideo(src)}>Retry</button>
        </div>
      )}
    </div>
  );
};

// Helper function to format time
function formatTime(seconds: number): string {
  if (isNaN(seconds)) return '0:00';

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default VideoPlayer;
