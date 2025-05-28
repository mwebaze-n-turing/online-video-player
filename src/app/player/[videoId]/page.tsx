// src/app/player/[videoId]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { serverConfig } from '@/config/server';
import ConfigurableVideoPlayer from '@/components/video/Player/ConfigurableVideoPlayer';

interface VideoPageProps {
  params: { videoId: string };
}

async function getVideoData(videoId: string) {
  const apiUrl = `${serverConfig.api.endpoints.videos}/${videoId}`;

  // Use server-side secrets for API auth
  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${serverConfig.secrets.videoApiKey}`,
    },
    next: { revalidate: 3600 }, // Revalidate every hour
  });

  if (!response.ok) {
    throw new Error('Video not found');
  }

  return response.json();
}

export default async function VideoPage({ params }: VideoPageProps) {
  try {
    const videoData = await getVideoData(params.videoId);

    return (
      <div>
        <h1>{videoData.title}</h1>
        <Suspense>
          <ConfigurableVideoPlayer videoId={params.videoId} title={videoData.title} />
        </Suspense>
        {/* Render additional video metadata */}
        <div className="mt-4 prose">
          <p>{videoData.description}</p>
          {/* Debug information in development */}
          {serverConfig.app.isDev && (
            <div className="p-4 bg-gray-100 rounded-lg mt-8">
              <h3>Debug Info</h3>
              <p>Environment: {serverConfig.app.environment}</p>
              <p>Video ID: {params.videoId}</p>
              <p>
                API URL: {serverConfig.api.endpoints.videos}/{params.videoId}
              </p>
              <p>HLS Enabled: {String(serverConfig.features.hls)}</p>
              <p>DASH Enabled: {String(serverConfig.features.dash)}</p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
