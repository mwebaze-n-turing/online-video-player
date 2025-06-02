'use client';

import { useEffect, useState } from 'react';

interface VideoPlayerContainerProps {
  src?: string;
  title?: string;
}

const VideoPlayerContainer: React.FC<VideoPlayerContainerProps> = ({
  src = '/videos/sample.mp4',
  title = 'Video Player',
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="video-player-container flex justify-center items-center mx-auto my-8 relative"
      style={{
        width: '100%',
        maxWidth: '960px',
        aspectRatio: '16 / 9',
        borderRadius: '8px',
        border: '2px solid #2d2d2d',
        backgroundColor: '#000',
        position: 'relative',
      }}
    >
      {isLoading ? (
        <div className="loading-state absolute inset-0 flex items-center justify-center bg-gray-900 rounded-md">
          <p className="text-white text-xl font-semibold">Loading...</p>
        </div>
      ) : (
        <video
          src={src}
          controls
          className="w-full h-full object-contain rounded-md"
          title={title}
          style={{
            borderRadius: '6px',
            backgroundColor: '#000',
          }}
        />
      )}
    </div>
  );
};

export default VideoPlayerContainer;
