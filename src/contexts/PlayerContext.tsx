'use client';

import { createContext, useContext, ReactNode, useState } from 'react';
import { VideoPlayerState } from '@/types/player.types';

type PlayerContextType = {
  playerState: VideoPlayerState;
  setPlayerState: (state: Partial<VideoPlayerState>) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }): JSX.Element {
  const [playerState, setPlayerState] = useState<VideoPlayerState>({
    isPlaying: false,
    volume: 1,
    currentTime: 0,
    duration: 0,
    isFullScreen: false,
    isMuted: false,
    quality: 'auto',
  });

  const updatePlayerState = (newState: Partial<VideoPlayerState>): void => {
    setPlayerState(prev => ({ ...prev, ...newState }));
  };

  const togglePlay = (): void => {
    updatePlayerState({ isPlaying: !playerState.isPlaying });
  };

  const setVolume = (volume: number): void => {
    updatePlayerState({ volume, isMuted: volume === 0 });
  };

  const seek = (time: number): void => {
    updatePlayerState({ currentTime: time });
  };

  return (
    <PlayerContext.Provider
      value={{
        playerState,
        setPlayerState: updatePlayerState,
        togglePlay,
        setVolume,
        seek,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayerContext(): PlayerContextType {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayerContext must be used within a PlayerProvider');
  }
  return context;
}
