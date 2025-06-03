import { useState, useEffect } from 'react';

export const useVideoPlayer = (videoRef: React.RefObject<HTMLVideoElement>, containerRef: React.RefObject<HTMLDivElement>) => {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  // Update duration once the video metadata is loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Update progress and current time during playback
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Handle play state changes
  const handlePlayState = () => {
    if (videoRef.current) {
      setPlaying(!videoRef.current.paused);
    }
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(!muted);
    }
  };

  // Set volume (0 to 1)
  const handleSetVolume = (value: number) => {
    if (videoRef.current) {
      videoRef.current.volume = value;
      setVolume(value);

      // If setting volume above 0, make sure it's not muted
      if (value > 0 && muted) {
        videoRef.current.muted = false;
        setMuted(false);
      }

      // If setting volume to 0, mute the video
      if (value === 0 && !muted) {
        videoRef.current.muted = true;
        setMuted(true);
      }
    }
  };

  // Set progress (seeking)
  const handleSetProgress = (value: number) => {
    if (videoRef.current) {
      const newTime = (value / 100) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      setProgress(value);
      setCurrentTime(newTime);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current
          .requestFullscreen()
          .then(() => {
            setFullscreen(true);
          })
          .catch(err => {
            console.error('Error attempting to enable fullscreen:', err);
          });
      } else {
        document
          .exitFullscreen()
          .then(() => {
            setFullscreen(false);
          })
          .catch(err => {
            console.error('Error attempting to exit fullscreen:', err);
          });
      }
    }
  };

  // Format time in MM:SS format
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Add event listeners when component mounts
  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      videoElement.addEventListener('play', handlePlayState);
      videoElement.addEventListener('pause', handlePlayState);

      // Initialize volume
      setVolume(videoElement.volume);
      setMuted(videoElement.muted);

      // Clean up event listeners on unmount
      return () => {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        videoElement.removeEventListener('play', handlePlayState);
        videoElement.removeEventListener('pause', handlePlayState);
      };
    }
  }, [videoRef]);

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return {
    playing,
    progress,
    volume,
    muted,
    currentTime,
    duration,
    fullscreen,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    setVolume: handleSetVolume,
    setProgress: handleSetProgress,
    formatTime,
  };
};

export default useVideoPlayer;
