export interface VideoMetadata {
  id: string;
  title: string;
  description?: string;
  duration: number;
  thumbnailUrl?: string;
  videoUrl: string;
  publishedAt?: string;
  views?: number;
  quality?: VideoQuality[];
}

export type VideoQuality = '240p' | '360p' | '480p' | '720p' | '1080p' | '4k' | 'auto';

export interface VideoPlayerState {
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  isFullScreen: boolean;
  isMuted: boolean;
  quality: VideoQuality;
}

export interface PlaylistItem {
  id: string;
  videoId: string;
  position: number;
  title: string;
  thumbnailUrl?: string;
  duration: number;
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  items: PlaylistItem[];
  createdAt: string;
  updatedAt: string;
}
