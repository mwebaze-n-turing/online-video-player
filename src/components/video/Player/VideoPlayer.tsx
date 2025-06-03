'use client';
import React, { useRef, useState, useEffect } from 'react';
import { VideoPlayerProps } from './types';
import { useVideoPlayer } from '@/hooks/useVideoPlayer';

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  autoPlay = false,
  controls = true,
  loop = false,
  muted = false,
  title,
  width = '100%',
  height = 'auto',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);

  const {
    playing,
    progress,
    volume,
    muted: isMuted,
    fullscreen,
    currentTime,
    duration,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    setVolume,
    setProgress,
    formatTime,
  } = useVideoPlayer(videoRef, containerRef);

  // Hide controls after 3 seconds of inactivity
  const handleMouseMove = () => {
    setIsControlsVisible(true);

    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }

    const timeout = setTimeout(() => {
      if (playing) {
        setIsControlsVisible(false);
      }
    }, 3000);

    setControlsTimeout(timeout);
  };

  // Clean up timeout on component unmount
  useEffect(() => {
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [controlsTimeout]);

  return (
    <div
      className="video-player relative overflow-hidden bg-black rounded-lg"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setIsControlsVisible(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        className="w-full h-full"
        onClick={togglePlay}
        playsInline
      />

      {/* Video Title Overlay */}
      {title && (
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent">
          <h2 className="text-white text-lg font-semibold">{title}</h2>
        </div>
      )}

      {/* Play/Pause Overlay */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button onClick={togglePlay} className="p-4 rounded-full bg-black/50 hover:bg-black/70 transition-colors" aria-label="Play video">
            <svg viewBox="0 0 24 24" width="24" height="24" className="w-10 h-10 fill-current text-white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      )}

      {/* Video Controls */}
      {controls && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-2 transition-opacity ${
            isControlsVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Progress bar */}
          <div className="progress-bar relative h-1 bg-white/30 rounded-full mb-2 cursor-pointer">
            <div className="absolute top-0 left-0 h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
          </div>

          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              {/* Play/Pause Button */}
              <button
                onClick={togglePlay}
                className="p-2 rounded hover:bg-white/20 transition-colors"
                aria-label={playing ? 'Pause' : 'Play'}
              >
                <svg viewBox="0 0 24 24" width="24" height="24" className="w-6 h-6 fill-current">
                  {playing ? <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /> : <path d="M8 5v14l11-7z" />}
                </svg>
              </button>

              {/* Volume Button */}
              <button
                onClick={toggleMute}
                className="p-2 rounded hover:bg-white/20 transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                <svg viewBox="0 0 24 24" width="24" height="24" className="w-6 h-6 fill-current">
                  {isMuted ? (
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  ) : (
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  )}
                </svg>
              </button>

              {/* Time Display */}
              <span className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div>
              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded hover:bg-white/20 transition-colors"
                aria-label={fullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                <svg viewBox="0 0 24 24" width="24" height="24" className="w-6 h-6 fill-current">
                  {fullscreen ? (
                    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                  ) : (
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
