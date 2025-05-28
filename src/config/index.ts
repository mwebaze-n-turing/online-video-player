// src/config/index.ts
import { env } from './env';

/**
 * Configuration service providing typed access to all environment variables
 */
export const config = {
  app: {
    name: env.NEXT_PUBLIC_APP_NAME,
    version: env.NEXT_PUBLIC_APP_VERSION,
    environment: env.NEXT_PUBLIC_APP_ENV,
    baseUrl: env.NEXT_PUBLIC_BASE_URL,
    isDev: env.NEXT_PUBLIC_APP_ENV === 'development',
    isTest: env.NEXT_PUBLIC_APP_ENV === 'test',
    isProd: env.NEXT_PUBLIC_APP_ENV === 'production',
  },

  api: {
    baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
    endpoints: {
      videos: env.NEXT_PUBLIC_VIDEO_API_ENDPOINT,
      playlists: env.NEXT_PUBLIC_PLAYLIST_API_ENDPOINT,
    },
    useMocks: env.NEXT_PUBLIC_ENABLE_MOCK_API,
  },

  cdn: {
    assetPrefix: env.NEXT_PUBLIC_ASSET_PREFIX,
    baseUrl: env.NEXT_PUBLIC_CDN_URL,
    videoUrl: env.NEXT_PUBLIC_VIDEO_CDN_URL,
    thumbnailUrl: env.NEXT_PUBLIC_THUMBNAIL_CDN_URL,
    useOptimization: env.NEXT_PUBLIC_ENABLE_CDN_OPTIMIZATION,
  },

  player: {
    defaultVolume: env.NEXT_PUBLIC_DEFAULT_VOLUME,
    autoplay: env.NEXT_PUBLIC_AUTOPLAY,
    defaultQuality: env.NEXT_PUBLIC_DEFAULT_QUALITY,
  },

  features: {
    hls: env.NEXT_PUBLIC_ENABLE_HLS,
    dash: env.NEXT_PUBLIC_ENABLE_DASH,
    analytics: env.NEXT_PUBLIC_ENABLE_ANALYTICS,
    thumbnails: env.NEXT_PUBLIC_ENABLE_THUMBNAILS,
    subtitleEditor: env.NEXT_PUBLIC_ENABLE_SUBTITLE_EDITOR,
    sharing: env.NEXT_PUBLIC_ENABLE_SHARING,
    debugTools: env.NEXT_PUBLIC_ENABLE_DEBUG_TOOLS,
    testHelpers: env.NEXT_PUBLIC_ENABLE_TEST_HELPERS,
  },

  keys: {
    mux: env.NEXT_PUBLIC_MUX_ENV_KEY,
    analytics: env.NEXT_PUBLIC_ANALYTICS_API_KEY,
  },

  // Helper methods for generating URLs
  urls: {
    /**
     * Generate a CDN URL for a video
     */
    getVideoUrl: (videoId: string, format = 'mp4'): string => {
      let formatSuffix = format;
      if (!format.startsWith('.')) {
        formatSuffix = `.${format}`;
      }

      return `${env.NEXT_PUBLIC_VIDEO_CDN_URL}/${videoId}${formatSuffix}`;
    },

    /**
     * Generate a CDN URL for a HLS stream
     */
    getHlsUrl: (videoId: string): string => {
      return `${env.NEXT_PUBLIC_VIDEO_CDN_URL}/${videoId}/playlist.m3u8`;
    },

    /**
     * Generate a CDN URL for a DASH stream
     */
    getDashUrl: (videoId: string): string => {
      return `${env.NEXT_PUBLIC_VIDEO_CDN_URL}/${videoId}/manifest.mpd`;
    },

    /**
     * Generate a CDN URL for a thumbnail
     */
    getThumbnailUrl: (videoId: string, size = 'medium'): string => {
      return `${env.NEXT_PUBLIC_THUMBNAIL_CDN_URL}/${videoId}_${size}.jpg`;
    },

    /**
     * Generate an API URL
     */
    getApiUrl: (path: string): string => {
      let apiPath = path;
      if (path.startsWith('/')) {
        apiPath = path.slice(1);
      }

      return `${env.NEXT_PUBLIC_API_BASE_URL}/${apiPath}`;
    },
  },
};

// Export the config type
export type AppConfig = typeof config;
