import { Suspense } from 'react';
import { VideoPlayer } from '@/components/video/Player/VideoPlayer';
import React from 'react';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Video Player App</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Featured Video</h2>
        <Suspense fallback={<div>Loading video player...</div>}>
          <VideoPlayer
            src="/videos/featured.mp4"
            title="Featured Video"
            // className="w-full max-w-4xl mx-auto"
            poster="/thumbnails/featured-thumbnail.jpg"
            controls
          />
        </Suspense>
      </section>

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
  );
}
