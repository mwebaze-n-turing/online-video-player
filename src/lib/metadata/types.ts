/**
 * Video metadata types for SEO and sharing
 */
export interface VideoMetadata {
  title: string;
  description: string;
  duration: number; // In seconds
  uploadDate: string; // ISO string
  thumbnailUrl: string;
  videoUrl: string;
  embedUrl?: string;
  width?: number;
  height?: number;
  contentUrl?: string;
  streamingUrl?: string;
  tags?: string[];
  category?: string;
  allowEmbed?: boolean;
  isLive?: boolean;
  viewCount?: number;
  publisher?: {
    name: string;
    logo?: string;
    url?: string;
  };
  author?: {
    name: string;
    url?: string;
  };
  restrictedCountries?: string[];
  expirationDate?: string; // ISO string
  isFamilyFriendly?: boolean;
  hasSubtitles?: boolean;
  subtitleLanguages?: string[];
  subtitleUrls?: Record<string, string>;
}

/**
 * OpenGraph video metadata
 */
export interface OpenGraphVideoMetadata {
  url: string;
  secureUrl?: string; // HTTPS URL
  type: 'video.other' | 'video.movie' | 'video.tv_show' | 'video.episode';
  width: number;
  height: number;
  alt?: string;
}

/**
 * Twitter card metadata for videos
 */
export interface TwitterCardVideoMetadata {
  card: 'player';
  site?: string;
  title: string;
  description: string;
  player: string;
  playerWidth: number;
  playerHeight: number;
  image: string;
  imageAlt?: string;
}

/**
 * Schema.org VideoObject structured data
 * @see https://schema.org/VideoObject
 */
export interface VideoStructuredData {
  '@context': 'https://schema.org';
  '@type': 'VideoObject';
  name: string;
  description: string;
  thumbnailUrl: string | string[];
  uploadDate: string;
  duration: string; // ISO 8601 duration format (PT1H30M)
  contentUrl?: string;
  embedUrl?: string;
  potentialAction?: {
    '@type': 'WatchAction';
    target: string | string[];
  };
  publisher?: {
    '@type': 'Organization';
    name: string;
    logo?: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  author?: {
    '@type': 'Person' | 'Organization';
    name: string;
    url?: string;
  };
  interactionStatistic?: {
    '@type': 'InteractionCounter';
    interactionType: {
      '@type': 'WatchAction' | 'LikeAction' | 'CommentAction' | 'ShareAction';
    };
    userInteractionCount: number;
  }[];
  inLanguage?: string;
  expires?: string; // ISO date
  familyFriendly?: boolean;
  regionsAllowed?: string;
  hasPart?: {
    '@type': 'Clip';
    name: string;
    startOffset: number;
    endOffset: number;
    url?: string;
  }[];
  transcript?: string;
  accessMode?: string[];
  subtitleLanguage?: string[];
}

/**
 * Configuration for the video player metadata
 */
export interface VideoMetadataConfig {
  siteTwitterHandle?: string;
  siteName: string;
  siteLogoUrl: string;
  siteUrl: string;
  defaultPlayerWidth: number;
  defaultPlayerHeight: number;
  defaultVideoType: OpenGraphVideoMetadata['type'];
  defaultShareImage?: string;
  baseEmbedUrl: string;
  enableStructuredData: boolean;
  enableOpenGraph: boolean;
  enableTwitterCards: boolean;
}

/**
 * Complete metadata for a video page
 */
export interface VideoPageMetadata {
  title: string;
  description: string;
  openGraph: {
    title: string;
    description: string;
    url: string;
    siteName: string;
    images: {
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }[];
    locale?: string;
    type: 'video.other' | 'video.movie' | 'video.tv_show' | 'video.episode';
    videos: OpenGraphVideoMetadata[];
  };
  twitter: TwitterCardVideoMetadata;
  alternates?: {
    canonical?: string;
    languages?: Record<string, string>;
  };
  structuredData: VideoStructuredData;
  keywords?: string[];
  robots?: {
    index?: boolean;
    follow?: boolean;
    nocache?: boolean;
    googleBot?: {
      index?: boolean;
      follow?: boolean;
    };
  };
}
