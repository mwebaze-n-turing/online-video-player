// src/components/video/Player/PlayerLoader.tsx
import React, { FC } from 'react';
import Spinner from '@/components/common/Spinner';

interface PlayerLoaderProps {
  isLoading: boolean;
  showThumb?: boolean;
  thumbnail?: string;
  className?: string;
}

export const PlayerLoader: FC<PlayerLoaderProps> = ({ isLoading, showThumb = true, thumbnail = '', className = '' }) => {
  if (!isLoading) return null;

  return (
    <div
      className={`
        absolute inset-0 z-20 flex items-center justify-center
        bg-black bg-opacity-50 transition-opacity
        ${className}
      `}
      aria-live="polite"
      aria-busy={isLoading}
    >
      {showThumb && thumbnail && (
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${thumbnail})` }} />
      )}
      <div className="relative z-10 flex flex-col items-center">
        <Spinner size="lg" color="white" />
        <p className="mt-4 text-white text-lg font-medium">Loading video...</p>
      </div>
    </div>
  );
};

export default PlayerLoader;
