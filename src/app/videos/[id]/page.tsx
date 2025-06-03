// src/app/videos/[id]/page.tsx (updated with loading states)
'use client';

import { useState, useEffect } from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { getVideoById } from '@/lib/api/videos';
import { generateNextJSVideoMetadata } from '@/lib/metadata/video-metadata';
import { VideoPlayer } from '@/components/video/Player';
import VideoInfoSkeleton from '@/components/video/Info/VideoInfoSkeleton';

interface VideoPageProps {
  params: {
    id: string;
  };
}

// Generate dynamic metadata for the page (server-side)
export async function generateMetadata({ params }: VideoPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const videoId = params.id;

  try {
    // Fetch the video data
    const video = await getVideoById(videoId);

    // If video not found, return default metadata
    if (!video) {
      return {
        title: 'Video Not Found',
        description: 'The requested video could not be found.',
      };
    }

    // Convert API data to VideoMetadata format
    const videoMetadata = {
      title: video.title,
      description: video.description,
      duration: video.duration,
      uploadDate: video.created_at,
      thumbnailUrl: video.thumbnail,
      videoUrl: video.url,
      embedUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/embed/${videoId}`,
      width: video.width,
      height: video.height,
      contentUrl: video.url,
      streamingUrl: video.streaming_url,
      tags: video.tags,
      category: video.category,
      allowEmbed: video.allow_embed,
      isLive: video.is_live,
      viewCount: video.view_count,
      publisher: {
        name: process.env.NEXT_PUBLIC_SITE_NAME || 'Video Player App',
        logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
        url: process.env.NEXT_PUBLIC_SITE_URL,
      },
      author: video.author
        ? {
            name: video.author.name,
            url: video.author.profile_url,
          }
        : undefined,
      isFamilyFriendly: video.family_friendly,
      hasSubtitles: video.has_subtitles,
      subtitleLanguages: video.subtitle_languages,
    };

    // Generate the metadata
    const config = {
      siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Video Player App',
      siteLogoUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
      siteTwitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE,
      defaultPlayerWidth: 1280,
      defaultPlayerHeight: 720,
      defaultVideoType: 'video.other',
      baseEmbedUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/embed`,
      enableStructuredData: true,
      enableOpenGraph: true,
      enableTwitterCards: true,
    };

    return generateNextJSVideoMetadata(videoMetadata, config, videoId);
  } catch (error) {
    console.error('Error generating video metadata:', error);

    // Return fallback metadata
    return {
      title: 'Video - Video Player App',
      description: 'Watch amazing videos on Video Player App',
    };
  }
}

// Client-side Video Page component with loading states
function VideoPageClient({ videoId }: { videoId: string }) {
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVideo() {
      try {
        setLoading(true);
        const videoData = await getVideoById(videoId);
        if (!videoData) {
          setError('Video not found');
        } else {
          setVideo(videoData);
        }
      } catch (err) {
        setError('Error loading video data');
        console.error('Failed to load video:', err);
      } finally {
        // Still set loading to false after a short delay to allow the player to initialize
        setTimeout(() => setLoading(false), 300);
      }
    }

    loadVideo();
  }, [videoId]);

  // Show error message if video failed to load
  if (error) {
    return (
      <div className="video-page-error">
        <h1>Error Loading Video</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="video-page-container">
      {/* Video player - always show player container, it has its own loading state */}
      <div className="video-player-wrapper">
        {video && <VideoPlayer src={video.url} poster={video.thumbnail} autoPlay={false} controls title={video.title} />}
        {!video && <div className="aspect-video bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>}
      </div>

      {/* Video info section - show skeleton during loading */}
      <div className="video-info">
        {loading || !video ? (
          <VideoInfoSkeleton />
        ) : (
          <>
            <h1>{video.title}</h1>
            <div className="video-meta">
              <span>{video.view_count} views</span>
              <span>•</span>
              <span>{new Date(video.created_at).toLocaleDateString()}</span>
            </div>
            <div className="video-description">
              <p>{video.description}</p>
            </div>
            {video.tags && video.tags.length > 0 && (
              <div className="video-tags">
                {video.tags.map((tag: string) => (
                  <span key={tag} className="tag">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Server component entry point
export default async function VideoPage({ params }: VideoPageProps) {
  const videoId = params.id;

  try {
    // Initial server-side check to verify video exists
    const video = await getVideoById(videoId);

    if (!video) {
      notFound();
    }

    // Return client-side component
    return <VideoPageClient videoId={videoId} />;
  } catch (error) {
    console.error('Server-side error loading video:', error);
    notFound();
  }
}
