// src/config/runtime.ts
import { config } from './index';

/**
 * Runtime feature detection and capabilities
 */
export const runtime = {
  // Check if code is running on client or server
  isClient: typeof window !== 'undefined',
  isServer: typeof window === 'undefined',

  // Browser capabilities detection (only available on client)
  capabilities: {
    hlsSupport: false,
    dashSupport: false,
    webmSupport: false,
    h265Support: false,
    vp9Support: false,
    avifSupport: false,
    fullscreenApi: false,
    pictureInPicture: false,
    mediaSession: false,
    webAudio: false,
  },

  // Initialize capabilities detection (call this on client)
  detectCapabilities: () => {
    if (typeof window === 'undefined') return;

    const video = document.createElement('video');

    // Check for HLS support (native)
    runtime.capabilities.hlsSupport = video.canPlayType('application/vnd.apple.mpegurl') !== '';

    // Check for DASH support
    runtime.capabilities.dashSupport = video.canPlayType('application/dash+xml') !== '';

    // Check WebM support
    runtime.capabilities.webmSupport = video.canPlayType('video/webm; codecs="vp8, vorbis"') !== '';

    // Check HEVC/H.265 support
    runtime.capabilities.h265Support =
      video.canPlayType('video/mp4; codecs="hev1"') !== '' || video.canPlayType('video/mp4; codecs="hvc1"') !== '';

    // Check VP9 support
    runtime.capabilities.vp9Support = video.canPlayType('video/webm; codecs="vp9"') !== '';

    // Check AVIF support
    const img = document.createElement('img');
    runtime.capabilities.avifSupport = typeof img.decode === 'function' && 'avif' in img.style;

    // Check fullscreen API support
    runtime.capabilities.fullscreenApi =
      document.documentElement.requestFullscreen !== undefined ||
      (document.documentElement as any).webkitRequestFullscreen !== undefined ||
      (document.documentElement as any).mozRequestFullScreen !== undefined ||
      (document.documentElement as any).msRequestFullscreen !== undefined;

    // Check Picture-in-Picture support
    runtime.capabilities.pictureInPicture = 'pictureInPictureEnabled' in document && document.pictureInPictureEnabled;

    // Check MediaSession API support
    runtime.capabilities.mediaSession = 'mediaSession' in navigator;

    // Check WebAudio API support
    runtime.capabilities.webAudio = typeof AudioContext !== 'undefined' || typeof (window as any).webkitAudioContext !== 'undefined';
  },

  // Get the best video format based on capabilities
  getBestVideoFormat: () => {
    if (runtime.capabilities.h265Support && config.features.hls) {
      return 'hls-h265';
    }

    if (runtime.capabilities.hlsSupport && config.features.hls) {
      return 'hls';
    }

    if (runtime.capabilities.dashSupport && config.features.dash) {
      return 'dash';
    }

    if (runtime.capabilities.vp9Support) {
      return 'webm-vp9';
    }

    return 'mp4';
  },
};
