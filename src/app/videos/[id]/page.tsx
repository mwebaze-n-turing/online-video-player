'use client';

import { useState, useEffect } from 'react';
import { VideoPlayer } from '@/components/video/Player/VideoPlayer';
import { sampleChapters, processChapters } from '@/data/sampleChapters';
import { Chapter } from '@/types/video';

export default function VideoPage({ params }: { params: { id: string } }) {
  const [videoData, setVideoData] = useState<{
    src: string;
    poster?: string;
    title: string;
    chapters?: Chapter[];
  } | null>(null);
  
  // In a real application, you would fetch this data from an API
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setVideoData({
        src: '/videos/featured.mp4', // Using the existing video
        poster: '/thumbnails/featured-thumbnail.jpg',
        title: 'Complete Video Tutorial',
        // Process chapters to ensure they have proper endTimes
        chapters: processChapters(sampleChapters)
      });
    }, 500);
  }, [params.id]);
  
  if (!videoData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{videoData.title}</h1>
        
        <div className="bg-gray-950 rounded-lg overflow-hidden mb-8">
          <VideoPlayer
            src={videoData.src}
            poster={videoData.poster}
            chapters={videoData.chapters}
          />
        </div>
        
        {/* Optional: Display chapter list outside the player */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Chapters</h2>
          <div className="grid gap-2">
            {videoData.chapters?.map(chapter => (
              <div 
                key={chapter.id} 
                className="p-4 bg-gray-800 rounded-md border-l-4 hover:bg-gray-700 transition-colors cursor-pointer" 
                style={{ borderColor: chapter.color || '#3b82f6' }}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium">{chapter.title}</h3>
                  <span className="text-gray-400 text-sm">
                    {new Date(chapter.startTime * 1000).toISOString().substr(14, 5)}
                  </span>
                </div>
                {chapter.description && (
                  <p className="text-gray-300 text-sm mt-2">{chapter.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}