// src/config/env.ts
import { z } from 'zod';

// Environment schema with validation
const envSchema = z.object({
  // App information
  NEXT_PUBLIC_APP_NAME: z.string(),
  NEXT_PUBLIC_APP_VERSION: z.string(),
  NEXT_PUBLIC_APP_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_BASE_URL: z.string().url(),

  // API endpoints
  NEXT_PUBLIC_API_BASE_URL: z.string(),
  NEXT_PUBLIC_PLAYLIST_API_ENDPOINT: z.string(),
  NEXT_PUBLIC_VIDEO_API_ENDPOINT: z.string(),

  // CDN endpoints
  NEXT_PUBLIC_ASSET_PREFIX: z.string().default(''),
  NEXT_PUBLIC_CDN_URL: z.string().url(),
  NEXT_PUBLIC_VIDEO_CDN_URL: z.string().url(),
  NEXT_PUBLIC_THUMBNAIL_CDN_URL: z.string().url(),

  // API keys
  NEXT_PUBLIC_MUX_ENV_KEY: z.string().optional(),
  NEXT_PUBLIC_ANALYTICS_API_KEY: z.string().optional(),

  // Feature flags (booleans)
  NEXT_PUBLIC_ENABLE_HLS: z.preprocess(val => val === 'true' || val === true, z.boolean()).default(true),
  NEXT_PUBLIC_ENABLE_DASH: z.preprocess(val => val === 'true' || val === true, z.boolean()).default(true),
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.preprocess(val => val === 'true' || val === true, z.boolean()).default(false),
  NEXT_PUBLIC_ENABLE_THUMBNAILS: z.preprocess(val => val === 'true' || val === true, z.boolean()).default(true),
  NEXT_PUBLIC_ENABLE_SUBTITLE_EDITOR: z.preprocess(val => val === 'true' || val === true, z.boolean()).default(false),
  NEXT_PUBLIC_ENABLE_SHARING: z.preprocess(val => val === 'true' || val === true, z.boolean()).default(true),
  NEXT_PUBLIC_ENABLE_MOCK_API: z.preprocess(val => val === 'true' || val === true, z.boolean()).default(false),
  NEXT_PUBLIC_ENABLE_DEBUG_TOOLS: z.preprocess(val => val === 'true' || val === true, z.boolean()).default(false),
  NEXT_PUBLIC_ENABLE_TEST_HELPERS: z.preprocess(val => val === 'true' || val === true, z.boolean()).default(false),
  NEXT_PUBLIC_ENABLE_CDN_OPTIMIZATION: z.preprocess(val => val === 'true' || val === true, z.boolean()).default(false),

  // Player settings
  NEXT_PUBLIC_DEFAULT_VOLUME: z.preprocess(val => parseFloat(String(val)), z.number().min(0).max(1)).default(0.8),
  NEXT_PUBLIC_AUTOPLAY: z.preprocess(val => val === 'true' || val === true, z.boolean()).default(false),
  NEXT_PUBLIC_DEFAULT_QUALITY: z.string().default('auto'),
});

// Process environment variables
function getEnvVariables() {
  // Get all environment variables
  const envVars = {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,

    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_PLAYLIST_API_ENDPOINT: process.env.NEXT_PUBLIC_PLAYLIST_API_ENDPOINT,
    NEXT_PUBLIC_VIDEO_API_ENDPOINT: process.env.NEXT_PUBLIC_VIDEO_API_ENDPOINT,

    NEXT_PUBLIC_ASSET_PREFIX: process.env.NEXT_PUBLIC_ASSET_PREFIX,
    NEXT_PUBLIC_CDN_URL: process.env.NEXT_PUBLIC_CDN_URL,
    NEXT_PUBLIC_VIDEO_CDN_URL: process.env.NEXT_PUBLIC_VIDEO_CDN_URL,
    NEXT_PUBLIC_THUMBNAIL_CDN_URL: process.env.NEXT_PUBLIC_THUMBNAIL_CDN_URL,

    NEXT_PUBLIC_MUX_ENV_KEY: process.env.NEXT_PUBLIC_MUX_ENV_KEY,
    NEXT_PUBLIC_ANALYTICS_API_KEY: process.env.NEXT_PUBLIC_ANALYTICS_API_KEY,

    NEXT_PUBLIC_ENABLE_HLS: process.env.NEXT_PUBLIC_ENABLE_HLS,
    NEXT_PUBLIC_ENABLE_DASH: process.env.NEXT_PUBLIC_ENABLE_DASH,
    NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
    NEXT_PUBLIC_ENABLE_THUMBNAILS: process.env.NEXT_PUBLIC_ENABLE_THUMBNAILS,
    NEXT_PUBLIC_ENABLE_SUBTITLE_EDITOR: process.env.NEXT_PUBLIC_ENABLE_SUBTITLE_EDITOR,
    NEXT_PUBLIC_ENABLE_SHARING: process.env.NEXT_PUBLIC_ENABLE_SHARING,
    NEXT_PUBLIC_ENABLE_MOCK_API: process.env.NEXT_PUBLIC_ENABLE_MOCK_API,
    NEXT_PUBLIC_ENABLE_DEBUG_TOOLS: process.env.NEXT_PUBLIC_ENABLE_DEBUG_TOOLS,
    NEXT_PUBLIC_ENABLE_TEST_HELPERS: process.env.NEXT_PUBLIC_ENABLE_TEST_HELPERS,
    NEXT_PUBLIC_ENABLE_CDN_OPTIMIZATION: process.env.NEXT_PUBLIC_ENABLE_CDN_OPTIMIZATION,

    NEXT_PUBLIC_DEFAULT_VOLUME: process.env.NEXT_PUBLIC_DEFAULT_VOLUME,
    NEXT_PUBLIC_AUTOPLAY: process.env.NEXT_PUBLIC_AUTOPLAY,
    NEXT_PUBLIC_DEFAULT_QUALITY: process.env.NEXT_PUBLIC_DEFAULT_QUALITY,
  };

  // Validate environment variables
  try {
    return envSchema.parse(envVars);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join('\n');

      throw new Error(`Environment validation failed:\n${missingVars}`);
    }
    throw error;
  }
}

// Export environment variables with types
export const env = getEnvVariables();

// Export the type
export type Env = z.infer<typeof envSchema>;
