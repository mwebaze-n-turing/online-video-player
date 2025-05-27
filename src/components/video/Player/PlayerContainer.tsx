// src/components/video/Player/PlayerContainer.tsx
'use client';

import React from 'react';
import Player from './Player';
import { PlayerProvider } from '@/contexts/PlayerContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

interface PlayerContainerProps {
  videoSrc: string;
  posterSrc?: string;
  title?: string;
  description?: string;
}

export default function PlayerContainer({ videoSrc, posterSrc, title, description }: PlayerContainerProps): JSX.Element {
  return (
    <ThemeProvider>
      <PlayerProvider>
        <div>
          {/* Video player with our custom styling */}
          <Player videoSrc={videoSrc} posterSrc={posterSrc} aspectRatio="16:9" />
          {/* Video info section */}
          {title && (
            <div className="p-4">
              <h2>{title}</h2>
              {description && <p>{description}</p>}
            </div>
          )}
        </div>
      </PlayerProvider>
    </ThemeProvider>
  );
}
