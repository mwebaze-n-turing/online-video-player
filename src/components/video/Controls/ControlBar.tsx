// src/components/video/Controls/ControlBar.tsx
import React, { useState, useRef } from 'react';
import { ControlButton } from './ControlButton';
import { PlayIcon, PauseIcon, VolumeUpIcon, VolumeMuteIcon, FullscreenIcon, ExitFullscreenIcon, SpeedIcon } from '../Icons';
import { useClickOutside } from '@/hooks/useClickOutside';
import { TimeDisplay } from './TimeDisplay';
import { ChaptersMenu } from './ChaptersMenu';
import { Chapter } from '@/types/video';

interface ControlBarProps {
  isPlaying: boolean;
  togglePlay: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  currentSpeed: number;
  onSpeedChange: (speed: number) => void;
  currentTime: number;
  duration: number;
  chapters?: Chapter[];
  currentChapter: Chapter | null;
  onChapterSelect: (chapter: Chapter) => void;
}

export const ControlBar = ({
  isPlaying,
  togglePlay,
  isMuted,
  toggleMute,
  volume,
  onVolumeChange,
  isFullscreen,
  toggleFullscreen,
  currentSpeed,
  onSpeedChange,
  currentTime,
  duration,
  chapters = [],
  currentChapter,
  onChapterSelect,
}: ControlBarProps) => {
  
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);
  const speeds = [0.5, 1, 1.25, 1.5, 2];
  
  const speedMenuRef = useClickOutside<HTMLDivElement>(() => {
    setShowSpeedOptions(false);
  });
  
  return (
    <div className="flex items-center justify-between">
      {/* Left section */}
      <div className="flex items-center space-x-2">
        <ControlButton
          onClick={togglePlay}
          tooltipText={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </ControlButton>
        <TimeDisplay currentTime={currentTime} duration={duration} />
      </div>
      
      {/* Center section (can show current chapter) */}
      <div className="flex-1 flex justify-center">
        {currentChapter && (
          <div className="text-white text-sm truncate max-w-xs">
            <span className="text-gray-400">Chapter: </span>
            {currentChapter.title}
          </div>
        )}
      </div>
      
      {/* Right section */}
      <div className="flex items-center space-x-2">
        {/* Chapters menu - only show if we have chapters */}
        {chapters.length > 0 && (
          <ChaptersMenu 
            chapters={chapters}
            currentChapter={currentChapter}
            onChapterSelect={onChapterSelect}
            currentTime={currentTime}
          />
        )}
      
        {/* Volume controls */}
        <div className="flex items-center space-x-2">
          <ControlButton
            onClick={toggleMute}
            tooltipText={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeMuteIcon /> : <VolumeUpIcon />}
          </ControlButton>
          <div className="w-20 hidden sm:block">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-full h-1 rounded-full appearance-none bg-gray-600 accent-white focus:outline-none"
              aria-label="Volume"
            />
          </div>
        </div>
        
        {/* Playback speed dropdown */}
        <div className="relative" ref={speedMenuRef}>
          <ControlButton
            onClick={() => setShowSpeedOptions(prev => !prev)}
            tooltipText="Playback Speed"
          >
            <span className="text-xs">
              {currentSpeed}x
            </span>
          </ControlButton>
          {showSpeedOptions && (
            <div className="absolute bottom-full mb-2 right-0 bg-gray-800 rounded p-1 shadow-lg z-50">
              <div className="flex flex-col">
                {speeds.map(speed => (
                  <button
                    key={speed}
                    onClick={() => {
                      onSpeedChange(speed);
                      setShowSpeedOptions(false);
                    }}
                    className={`px-3 py-1 text-sm text-left rounded hover:bg-gray-700 ${
                      speed === currentSpeed ? 'bg-blue-600' : ''
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <ControlButton
          onClick={toggleFullscreen}
          tooltipText={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
        </ControlButton>
      </div>
    </div>
  );
};

export default ControlBar;
