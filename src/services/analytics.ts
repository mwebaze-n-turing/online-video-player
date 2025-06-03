// // src/services/analytics.ts
// 'use client';

// import muxData from '@mux/mux-data';
// import { videoConfig } from '@/lib/video/clientConfig';

// export interface VideoMetadata {
//   videoId: string;
//   title: string;
//   duration?: number;
//   playerName: string;
//   playerVersion: string;
//   videoUrl: string;
//   mimeType?: string;
//   videoWidth?: number;
//   videoHeight?: number;
// }

// export class VideoAnalyticsService {
//   private videoElement: HTMLVideoElement | null = null;
//   private metadata: VideoMetadata | null = null;
//   private events: Record<string, Function> = {};
//   private muxDataInstance: any = null;
//   private sessionStartTime: number = 0;
//   private playbackStats: Record<string, any> = {};
//   private isTracking: boolean = false;

//   constructor(videoElement: HTMLVideoElement, metadata: VideoMetadata) {
//     this.videoElement = videoElement;
//     this.metadata = metadata;
//     this.initializePlaybackStats();
//   }

//   public initialize(): void {
//     // Initialize Mux Data if API key is available
//     const muxInitOptions = {
//       data: {
//         env_key: process.env.NEXT_PUBLIC_MUX_ENV_KEY,
//         player_name: this.metadata?.playerName || 'custom-player',
//         player_version: this.metadata?.playerVersion || '1.0.0',
//         video_id: this.metadata?.videoId,
//         video_title: this.metadata?.title,
//         video_duration: this.metadata?.duration,
//         video_stream_type: this.detectStreamType(this.metadata?.videoUrl || ''),
//       },
//     };

//     if (process.env.NEXT_PUBLIC_MUX_ENV_KEY) {
//       this.muxDataInstance = muxData(this.videoElement!, muxInitOptions);
//     }

//     this.startTracking();
//   }

//   private detectStreamType(url: string): string {
//     if (url.includes('.m3u8')) {
//       return 'hls';
//     } else if (url.includes('.mpd')) {
//       return 'dash';
//     } else {
//       return 'on-demand';
//     }
//   }

//   private initializePlaybackStats(): void {
//     this.playbackStats = {
//       playCount: 0,
//       pauseCount: 0,
//       seekCount: 0,
//       bufferingCount: 0,
//       bufferingDuration: 0,
//       totalPlayTime: 0,
//       watchPercentage: 0,
//       qualitySwitches: 0,
//       errors: 0,
//       lastPlayheadPosition: 0,
//       startTime: Date.now(),
//       playbackSessions: [],
//     };
//   }

//   private startTracking(): void {
//     if (!this.videoElement || this.isTracking) return;
//     this.isTracking = true;

//     // Set up event listeners for all tracked events
//     videoConfig.analyticsConfig.videoEventsToTrack.forEach(eventName => {
//       const handler = this.createEventHandler(eventName);
//       this.events[eventName] = handler;
//       this.videoElement!.addEventListener(eventName, handler);
//     });

//     // Custom buffering detection
//     let bufferingStartTime = 0;
//     this.videoElement.addEventListener('waiting', () => {
//       bufferingStartTime = Date.now();
//       this.playbackStats.bufferingCount++;
//     });

//     this.videoElement.addEventListener('playing', () => {
//       if (bufferingStartTime > 0) {
//         const bufferDuration = (Date.now() - bufferingStartTime) / 1000;
//         this.playbackStats.bufferingDuration += bufferDuration;
//         bufferingStartTime = 0;
//       }
//     });

//     // Track playback session
//     this.sessionStartTime = Date.now();

//     // Regular playhead tracking at 5-second intervals
//     const playheadTrackingInterval = setInterval(() => {
//       if (this.videoElement && !this.videoElement.paused) {
//         const currentTime = this.videoElement.currentTime;
//         const duration = this.videoElement.duration || 0;

//         // Update watch percentage
//         if (duration > 0) {
//           this.playbackStats.watchPercentage = (currentTime / duration) * 100;
//         }

//         // Track play time
//         const elapsed = currentTime - (this.playbackStats.lastPlayheadPosition || 0);
//         if (elapsed > 0 && elapsed < 5) {
//           // Protect against seeks
//           this.playbackStats.totalPlayTime += elapsed;
//         }

//         this.playbackStats.lastPlayheadPosition = currentTime;

//         // Send analytics event
//         this.trackEvent('playhead_update', {
//           currentTime,
//           duration,
//           watchPercentage: this.playbackStats.watchPercentage,
//         });
//       }
//     }, 5000);

//     // Clean up on video ended or unload
//     const cleanup = () => {
//       clearInterval(playheadTrackingInterval);
//       this.endSession();
//       this.isTracking = false;

//       // Remove all event listeners
//       if (this.videoElement) {
//         Object.entries(this.events).forEach(([eventName, handler]) => {
//           this.videoElement!.removeEventListener(eventName, handler as any);
//         });
//       }
//     };

//     this.videoElement.addEventListener('ended', cleanup);
//     this.videoElement.addEventListener('emptied', cleanup);
//   }

//   private createEventHandler(eventName: string): EventListener {
//     return ((event: Event) => {
//       // Update metrics based on event type
//       switch (eventName) {
//         case 'play':
//           this.playbackStats.playCount++;
//           break;
//         case 'pause':
//           this.playbackStats.pauseCount++;
//           break;
//         case 'seeking':
//           this.playbackStats.seekCount++;
//           break;
//         case 'error':
//           this.playbackStats.errors++;
//           break;
//         // Add more specific event handling as needed
//       }

//       // Track the event
//       this.trackEvent(eventName, { timestamp: Date.now() });
//     }) as EventListener;
//   }

//   private trackEvent(eventName: string, data: any = {}): void {
//     // Send to your analytics system
//     if (process.env.NEXT_PUBLIC_ENABLE_VIDEO_ANALYTICS === 'true') {
//       console.log(`ANALYTICS: ${eventName}`, {
//         videoId: this.metadata?.videoId,
//         ...data,
//       });

//       // Here you would send to your actual analytics endpoint
//       /*
//       fetch('/api/analytics', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           event: eventName,
//           videoId: this.metadata?.videoId,
//           ...data
//         })
//       }).catch(err => console.error('Analytics error:', err));
//       */
//     }
//   }

//   private endSession(): void {
//     const sessionDuration = (Date.now() - this.sessionStartTime) / 1000;

//     // Add session to history
//     this.playbackStats.playbackSessions.push({
//       startTime: this.sessionStartTime,
//       endTime: Date.now(),
//       duration: sessionDuration,
//       watchPercentage: this.playbackStats.watchPercentage,
//     });

//     // Track session end
//     this.trackEvent('session_end', {
//       sessionDuration,
//       playCount: this.playbackStats.playCount,
//       pauseCount: this.playbackStats.pauseCount,
//       seekCount: this.playbackStats.seekCount,
//       bufferingCount: this.playbackStats.bufferingCount,
//       bufferingDuration: this.playbackStats.bufferingDuration,
//       totalPlayTime: this.playbackStats.totalPlayTime,
//       watchPercentage: this.playbackStats.watchPercentage,
//       errors: this.playbackStats.errors,
//     });

//     // Reset session
//     this.sessionStartTime = 0;
//   }

//   public dispose(): void {
//     if (this.muxDataInstance) {
//       this.muxDataInstance.destroy();
//     }

//     this.endSession();
//     this.isTracking = false;
//   }
// }
