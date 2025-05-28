// src/lib/video/streamingProvider.ts
'use client';

import Hls from 'hls.js';
import dashjs from 'dashjs';
import { videoConfig } from './clientConfig';

export class StreamingProvider {
  private videoElement: HTMLVideoElement | null = null;
  private hlsInstance: Hls | null = null;
  private dashInstance: dashjs.MediaPlayerClass | null = null;

  constructor(videoElement: HTMLVideoElement) {
    this.videoElement = videoElement;
  }

  public setupHls(src: string): void {
    // Destroy existing instances
    this.destroyInstances();

    // Check if HLS is supported natively
    if (this.videoElement?.canPlayType('application/vnd.apple.mpegurl')) {
      this.videoElement.src = src;
      return;
    }

    // Check if HLS.js is supported
    if (Hls.isSupported()) {
      this.hlsInstance = new Hls(videoConfig.hlsConfig);
      this.hlsInstance.loadSource(src);
      this.hlsInstance.attachMedia(this.videoElement!);

      this.hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
        // Expose quality levels if needed
        const levels = this.hlsInstance?.levels || [];
        return levels;
      });

      this.hlsInstance.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // Try to recover network error
              this.hlsInstance?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              // Try to recover media error
              this.hlsInstance?.recoverMediaError();
              break;
            default:
              // Cannot recover
              this.destroyInstances();
              break;
          }
        }
      });
    }
  }

  public setupDash(src: string): void {
    // Destroy existing instances
    this.destroyInstances();

    if (dashjs.supportsMediaSource()) {
      this.dashInstance = dashjs.MediaPlayer().create();
      this.dashInstance.updateSettings(videoConfig.dashConfig);
      this.dashInstance.initialize(this.videoElement!, src, true);

      this.dashInstance.on(dashjs.MediaPlayer.events.QUALITY_CHANGE_REQUESTED, (e: any) => {
        // Quality change monitoring
      });

      this.dashInstance.on(dashjs.MediaPlayer.events.ERROR, (e: any) => {
        // Error handling
        console.error('DASH playback error:', e);
      });
    }
  }

  public destroyInstances(): void {
    if (this.hlsInstance) {
      this.hlsInstance.destroy();
      this.hlsInstance = null;
    }

    if (this.dashInstance) {
      this.dashInstance.reset();
      this.dashInstance = null;
    }
  }

  // Auto-detect streaming type and set up appropriate player
  public setupStreamingFromUrl(url: string): void {
    if (url.includes('.m3u8')) {
      this.setupHls(url);
    } else if (url.includes('.mpd')) {
      this.setupDash(url);
    } else {
      // Standard video format, use native player
      if (this.videoElement) {
        this.videoElement.src = url;
      }
    }
  }
}
