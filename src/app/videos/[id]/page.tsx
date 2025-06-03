// src/app/videos/[id]/page.tsx (updated with responsive wrapper)
'use client';

import { useState, useEffect } from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { getVideoById } from '@/lib/api/videos';
import { generateNextJSVideoMetadata } from '@/lib/metadata/video-metadata';
import { VideoPlayer } from '@/components/video/Player';
import { ResponsivePlayerWrapper } from '@/components/video/Player/ResponsivePlayerWrapper';
import VideoInfoSkeleton from '@/components/video/Info/VideoInfoSkeleton';

// Import responsive styles
import '@/styles/components/video-player.css';

interface VideoPageProps {
  params: {
    id: string;
  };
}

// Generate dynamic metadata for the page (server-side)
export async function generateMetadata(
  { params }: VideoPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // ... existing metadata generation code ...
}

// Client-side Video Page component with responsive wrapper
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
        setTimeout(() => setLoading(false), 300);
      }
    }
    
    loadVideo();
  }, [videoId]);
  
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
      {/* Use responsive wrapper */}
      <ResponsivePlayerWrapper
        aspectRatio="16:9"
        maintainAspectRatio={true}
        maxWidth="800px"
        className="mb-6"
      >
        {video ? (
          <VideoPlayer 
            src={video.url} 
            poster={video.thumbnail}
            autoPlay={false}
            controls
            title={video.title}
          />
        ) : (
          <div className="aspect-video bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>
        )}
      </ResponsivePlayerWrapper>
      
      {/* Responsive video info container */}
      <div className="video-info w-full sm:w-[90%] mx-auto" style={{ maxWidth: '800px' }}>
        {loading || !video ? (
          <VideoInfoSkeleton />
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
            <div className="video-meta flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
              <span>{video.view_count.toLocaleString()} views</span>
              <span className="mx-2">•</span>
              <span>{new Date(video.created_at).toLocaleDateString()}</span>
            </div>
            <div className="video-description mb-6">
              <p className="text-gray-800 dark:text-gray-200">{video.description}</p>
            </div>
            {video.tags && video.tags.length > 0 && (
              <div className="video-tags flex flex-wrap gap-2">
                {video.tags.map((tag: string) => (
                  <span 
                    key={tag} 
                    className="tag px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
                  >
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