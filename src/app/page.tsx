import { Suspense } from 'react';
import { VideoPlayer } from '@/components/video/Player/VideoPlayer';
import React from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Full width video player section */}
      <section className="w-full">
        <Suspense fallback={
          <div className="w-full aspect-video bg-black flex items-center justify-center">
            <div className="text-white">Loading video player...</div>
          </div>
        }>
          <VideoPlayer
            src="/videos/featured.mp4"
            poster="/thumbnails/featured-thumbnail.jpg"
          />
        </Suspense>
      </section>

      {/* Content section with container */}
      <div className="container mx-auto px-4 py-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Popular Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Video thumbnails would go here */}
            <div className="bg-gray-200 rounded-lg p-4 aspect-video flex items-center justify-center">Video Thumbnail 1</div>
            <div className="bg-gray-200 rounded-lg p-4 aspect-video flex items-center justify-center">Video Thumbnail 2</div>
            <div className="bg-gray-200 rounded-lg p-4 aspect-video flex items-center justify-center">Video Thumbnail 3</div>
          </div>
        </section>
      </div>
    </div>
  );
}
