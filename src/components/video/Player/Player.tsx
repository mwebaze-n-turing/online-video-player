// src/components/video/Player/Player.tsx
'use client';

import React, { useState } from 'react';
import { usePlayerContext } from '@/contexts/PlayerContext';
import PlayPauseButton from '@/components/video/Controls/PlayPause';
import Timeline from '@/components/video/Controls/Timeline';
import VolumeControl from '@/components/video/Controls/Volume';
import FullScreenButton from '@/components/video/Controls/FullScreen';

interface PlayerProps {
  videoSrc?: string;
  posterSrc?: string;
  aspectRatio?: '16:9' | '4:3' | '21:9' | '1:1' | '9:16';
}

export default function Player({ videoSrc = "/videos/featured.mp4", posterSrc, aspectRatio = '16:9' }: PlayerProps): JSX.Element {
  const { playerState, togglePlay } = usePlayerContext();
  const [controlsVisible, setControlsVisible] = useState(true);

  // Hide controls after 3 seconds of inactivity
  const showControlsTemporarily = () => {
    setControlsVisible(true);
    // Add timeout to hide controls
  };

  return (
    <div>
      {/* Aspect ratio container */}
      <div className={`aspect-video-container aspect-video-${aspectRatio.replace(':', '\\:')}`}>
        {/* Video element */}
        <video
          src={videoSrc}
          poster={posterSrc}
          className="aspect-video-content video-crossfade"
          onClick={togglePlay}
          onMouseMove={showControlsTemporarily}
          playsInline
        />

        {/* Overlay gradients */}
        <div className="player-overlay-bottom" />
        <div className="player-overlay-top" />
        {/* Center play button (visible when paused) */}
        {!playerState.isPlaying && (
          <div className="player-center-controls animate-fade-in">
            <button>
              <svg>
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        )}

        {/* Bottom controls */}
        <div>
          {/* Timeline */}
          <Timeline />
          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PlayPauseButton />
              <VolumeControl />
              <span>{/* Time display */}</span>
            </div>
            <div>
              <FullScreenButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
