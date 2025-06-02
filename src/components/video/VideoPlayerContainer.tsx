"use client";

import { useState, useEffect } from 'react';

interface VideoPlayerContainerProps {
  src?: string;
  title?: string;
}

const VideoPlayerContainer: React.FC<VideoPlayerContainerProps> = ({ src = '/videos/sample.mp4', title = 'Video Player' }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="video-player-container flex justify-center items-center mx-auto my-8 relative"
      style={{ width: '800px', height: '450px', borderRadius: '8px', border: '2px solid #2d2d2d' }}
    >
      {isLoading ? (
        <div className="loading-state absolute inset-0 flex items-center justify-center bg-gray-900 rounded-md">
          <p className="text-white text-xl font-semibold">Loading...</p>
        </div>
      ) : (
        <video
          src={src}
          width={800}
          height={450}
          controls
          className="rounded-md"
          title={title}
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      )}
    </div>
  );
};

export default VideoPlayerContainer;
