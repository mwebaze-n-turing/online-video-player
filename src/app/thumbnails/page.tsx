import React from 'react';
import { VideoThumbnail } from '@/components/video/Thumbnail/VideoThumbnail';
import { fallbackThumbnails } from '@/data/sampleThumbnails';

export const metadata = {
  title: 'Video Thumbnails | Video Player App',
  description: 'Browse our collection of video thumbnails',
};

export default function ThumbnailsPage() {
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Video Thumbnails</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {fallbackThumbnails.map((thumbnail) => (
            <VideoThumbnail
              key={thumbnail.id}
              id={thumbnail.id}
              title={thumbnail.title}
              thumbnailUrl={thumbnail.thumbnailUrl}
              duration={thumbnail.duration}
              views={thumbnail.views}
              uploadDate={thumbnail.uploadDate}
            />
          ))}
        </div>
      </div>
    </>
  );
}