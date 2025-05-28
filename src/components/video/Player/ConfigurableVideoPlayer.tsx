// src/components/video/Player/ConfigurableVideoPlayer.tsx
'use client';

import React from 'react';
import VideoPlayer from './VideoPlayer';
import { useConfig } from '@/hooks/useConfig';

interface ConfigurableVideoPlayerProps {
  videoId: string;
  title?: string;
}

export default function ConfigurableVideoPlayer({ videoId, title }: ConfigurableVideoPlayerProps): JSX.Element {
  const config = useConfig();

  // Skip rendering if features are disabled
  if (!config.features.hls && !config.features.dash) {
    return <div>Video streaming features are disabled in this environment.</div>;
  }

  // Get optimal video URL based on capabilities
  const videoUrl = config.player.getBestFormat(videoId);

  // Get thumbnail URL
  const thumbnailUrl = config.urls.getThumbnailUrl(videoId);

  return (
    <VideoPlayer
      src={videoUrl}
      posterSrc={thumbnailUrl}
      title={title}
      autoplay={config.player.autoplay}
      muted={false}
      analyticsEnabled={config.features.analytics}
      analyticsApiKey={config.keys.analytics}
    />
  );
}
