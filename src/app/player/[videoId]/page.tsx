// src/app/player/[videoId]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import VideoPlayer from '@/components/video/Player/VideoPlayer';

// Types for API response
interface VideoData {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  posterUrl?: string;
  subtitles?: {
    language: string;
    label: string;
    url: string;
    type: 'vtt' | 'srt';
    default?: boolean;
  }[];
}

// Fetch video data (runs on server)
async function getVideoData(videoId: string): Promise<VideoData> {
  // In a real app, fetch from your API
  // For example: return fetch(`${process.env.NEXT_PUBLIC_VIDEO_API_ENDPOINT}/${videoId}`).then(res => res.json());

  // Mock data for example
  const videos: Record<string, VideoData> = {
    'demo-video': {
      id: 'demo-video',
      title: 'Demo Video',
      description: 'This is a demo video for our Next.js video player',
      videoUrl: '/videos/demo.mp4', // Static file in public directory
      posterUrl: '/thumbnails/demo-poster.jpg',
      subtitles: [
        {
          language: 'en',
          label: 'English',
          url: '/subtitles/demo-en.vtt',
          type: 'vtt',
          default: true,
        },
        {
          language: 'es',
          label: 'Spanish',
          url: '/subtitles/demo-es.vtt',
          type: 'vtt',
        },
      ],
    },
    'hls-example': {
      id: 'hls-example',
      title: 'HLS Streaming Example',
      description: 'A sample HLS stream',
      videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      posterUrl: '/thumbnails/hls-poster.jpg',
    },
  };

  const video = videos[videoId];

  if (!video) {
    throw new Error('Video not found');
  }

  return video;
}

// Server Component
export default async function VideoPage({ params }: { params: { videoId: string } }) {
  try {
    const videoData = await getVideoData(params.videoId);

    // Map subtitles from API format to component format
    const subtitles = videoData.subtitles?.map(sub => ({
      id: `${sub.language}-${Math.random().toString(36).slice(2)}`,
      language: sub.language,
      label: sub.label,
      src: sub.url,
      default: sub.default,
      type: sub.type,
    }));

    return (
      <div>
        <h1>{videoData.title}</h1>
        {/* Wrap video player in Suspense for better loading experience */}
        <Suspense>
          {/* Client component with dynamic import for better performance */}
          <VideoPlayer
            src={videoData.videoUrl}
            posterSrc={videoData.posterUrl}
            title={videoData.title}
            subtitles={subtitles as any}
            autoplay={false}
            muted={false}
            className="rounded-lg shadow-lg overflow-hidden"
          />
        </Suspense>
        <div className="mt-6">
          <h2>Description</h2>
          <p>{videoData.description}</p>
        </div>
      </div>
    );
  } catch (error) {
    // Use Next.js not found page if video doesn't exist
    notFound();
  }
}

// Generate static params for common videos (optional)
export function generateStaticParams() {
  // Return paths for videos you want to pre-render
  return [{ videoId: 'demo-video' }, { videoId: 'hls-example' }];
}
