// src/hooks/useConfig.ts
'use client';

import { useEffect, useMemo } from 'react';
import { config } from '@/config';
import { runtime } from '@/config/runtime';

/**
 * Hook for accessing application configuration with runtime detection
 */
export function useConfig() {
  // Run capabilities detection on mount (client-side only)
  useEffect(() => {
    runtime.detectCapabilities();
  }, []);

  // Combined configuration with runtime values
  const combinedConfig = useMemo(() => {
    return {
      ...config,
      runtime,

      // Enhanced methods that use runtime capabilities
      player: {
        ...config.player,

        // Get best format based on browser capabilities
        getBestFormat: (videoId: string): string => {
          const bestFormat = runtime.getBestVideoFormat();

          switch (bestFormat) {
            case 'hls':
            case 'hls-h265':
              return config.urls.getHlsUrl(videoId);
            case 'dash':
              return config.urls.getDashUrl(videoId);
            case 'webm-vp9':
              return config.urls.getVideoUrl(videoId, '.webm');
            default:
              return config.urls.getVideoUrl(videoId);
          }
        },
      },

      // Enhanced feature detection that combines config and runtime
      features: {
        ...config.features,
        supportsHls: config.features.hls && (runtime.capabilities.hlsSupport || typeof Hls !== 'undefined'),
        supportsDash: config.features.dash && (runtime.capabilities.dashSupport || typeof dashjs !== 'undefined'),
      },
    };
  }, []);

  return combinedConfig;
}
