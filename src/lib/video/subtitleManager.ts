// src/lib/video/subtitleManager.ts
'use client';

import { parse as parseSRT } from 'srt-parser-2';
import { parseSync as parseVTT } from 'webvtt-parser';

export interface Subtitle {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
}

export interface SubtitleTrack {
  id: string;
  language: string;
  label: string;
  src: string;
  default?: boolean;
  type: 'vtt' | 'srt';
}

export class SubtitleManager {
  private videoElement: HTMLVideoElement | null = null;
  private subtitleTracks: SubtitleTrack[] = [];
  private activeTrackId: string | null = null;
  private parsedSubtitles: Map<string, Subtitle[]> = new Map();
  private subtitleDisplay: HTMLElement | null = null;

  constructor(videoElement: HTMLVideoElement, subtitleDisplay: HTMLElement) {
    this.videoElement = videoElement;
    this.subtitleDisplay = subtitleDisplay;
  }

  public async addTrack(track: SubtitleTrack): Promise<void> {
    this.subtitleTracks.push(track);

    try {
      const response = await fetch(track.src);
      const text = await response.text();

      let parsed: Subtitle[] = [];

      if (track.type === 'vtt') {
        const vttParser = new (window as any).WebVTTParser();
        const result = vttParser.parse(text);

        parsed = result.cues.map((cue: any) => ({
          id: cue.id || `subtitle-${Math.random().toString(36).substring(2, 9)}`,
          startTime: cue.startTime,
          endTime: cue.endTime,
          text: cue.text,
        }));
      } else if (track.type === 'srt') {
        const srtResult = parseSRT(text);

        parsed = srtResult.map(item => ({
          id: item.id || `subtitle-${Math.random().toString(36).substring(2, 9)}`,
          startTime: this.srtTimeToSeconds(item.startTime),
          endTime: this.srtTimeToSeconds(item.endTime),
          text: item.text,
        }));
      }

      this.parsedSubtitles.set(track.id, parsed);

      // If this is the default track, activate it
      if (track.default && !this.activeTrackId) {
        this.activateTrack(track.id);
      }
    } catch (error) {
      console.error(`Error parsing subtitle track ${track.id}:`, error);
    }
  }

  public activateTrack(trackId: string): void {
    this.activeTrackId = trackId;

    // Start monitoring for subtitle display
    this.startSubtitleMonitoring();
  }

  public deactivateSubtitles(): void {
    this.activeTrackId = null;
    if (this.subtitleDisplay) {
      this.subtitleDisplay.innerHTML = '';
    }
  }

  private srtTimeToSeconds(timeString: string): number {
    const parts = timeString.split(':');
    const secondsAndMs = parts[2].split(',');

    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(secondsAndMs[0], 10);
    const ms = parseInt(secondsAndMs[1], 10);

    return hours * 3600 + minutes * 60 + seconds + ms / 1000;
  }

  private startSubtitleMonitoring(): void {
    if (!this.videoElement) return;

    const updateSubtitles = () => {
      if (!this.activeTrackId || !this.videoElement || !this.subtitleDisplay) return;

      const currentTime = this.videoElement.currentTime;
      const subtitles = this.parsedSubtitles.get(this.activeTrackId) || [];

      const activeSubtitles = subtitles.filter(sub => currentTime >= sub.startTime && currentTime <= sub.endTime);

      if (activeSubtitles.length) {
        this.subtitleDisplay.innerHTML = activeSubtitles
          .map(
            sub => `
<div>
${sub.text}

</div>
`
          )
          .join('');
      } else {
        this.subtitleDisplay.innerHTML = '';
      }
    };

    // Update at appropriate interval
    const intervalId = setInterval(updateSubtitles, 100);

    // Store the interval ID for cleanup
    (this.videoElement as any).__subtitleIntervalId = intervalId;

    // Clean up on video ended or unload
    const cleanup = () => {
      clearInterval(intervalId);
    };

    this.videoElement.addEventListener('ended', cleanup);
    this.videoElement.addEventListener('emptied', cleanup);

    // Initial update
    updateSubtitles();
  }
}
