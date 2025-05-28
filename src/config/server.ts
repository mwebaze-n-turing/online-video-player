// src/config/server.ts
import { config } from './index';

/**
 * Server-only configuration values and helpers
 * Keep this separate from client code for security
 */
export const serverConfig = {
  ...config,

  // Add server-only fields here
  secrets: {
    videoApiKey: process.env.VIDEO_API_KEY || '',
    adminApiKey: process.env.ADMIN_API_KEY || '',
    jwtSecret: process.env.JWT_SECRET || '',
  },

  // Database configuration
  database: {
    url: process.env.DATABASE_URL || '',
    user: process.env.DATABASE_USER || '',
    password: process.env.DATABASE_PASSWORD || '',
  },

  // Server-side video processing
  videoProcessing: {
    tempDir: process.env.VIDEO_PROCESSING_TEMP_DIR || '/tmp',
    ffmpegPath: process.env.FFMPEG_PATH || '',
    hlsSegmentDuration: parseInt(process.env.HLS_SEGMENT_DURATION || '6', 10),
    defaultResolutions: (process.env.DEFAULT_RESOLUTIONS || '1080,720,480,360').split(',').map(r => parseInt(r, 10)),
  },
};
