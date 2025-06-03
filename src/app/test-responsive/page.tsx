// src/app/test-responsive/page.tsx
'use client';

import React, { useState } from 'react';
import { ResponsivePlayerWrapper } from '@/components/video/Player/ResponsivePlayerWrapper';
import { VideoPlayer } from '@/components/video/Player';

// Import responsive styles
import '@/styles/components/video-player.css';

export default function TestResponsivePage() {
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '4:3' | '1:1' | '21:9'>('16:9');
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [maxWidth, setMaxWidth] = useState('800px');

  const testVideo = {
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    title: 'Big Buck Bunny',
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Responsive Video Player Test</h1>

      <div className="mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aspect Ratio</label>
            <select
              value={aspectRatio}
              onChange={e => setAspectRatio(e.target.value as any)}
              className="block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="16:9">16:9 (Widescreen)</option>
              <option value="4:3">4:3 (Standard)</option>
              <option value="1:1">1:1 (Square)</option>
              <option value="21:9">21:9 (Ultra-wide)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Width</label>
            <select
              value={maxWidth}
              onChange={e => setMaxWidth(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="600px">600px</option>
              <option value="800px">800px</option>
              <option value="1000px">1000px</option>
              <option value="1200px">1200px</option>
              <option value="100%">100%</option>
            </select>
          </div>

          <div className="flex items-end">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={maintainAspect}
                onChange={e => setMaintainAspect(e.target.checked)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Maintain aspect ratio</span>
            </label>
          </div>
        </div>

        <div className="p-2 bg-gray-100 text-xs font-mono rounded">
          <p>
            Current window width:{' '}
            <span id="window-width" className="font-semibold">
              -
            </span>
            px
          </p>
          <p>
            Current settings: {aspectRatio}, maxWidth: {maxWidth}, maintainAspect: {maintainAspect ? 'true' : 'false'}
          </p>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Using ResponsivePlayerWrapper</h2>
        <ResponsivePlayerWrapper aspectRatio={aspectRatio} maintainAspectRatio={maintainAspect} maxWidth={maxWidth} className="mb-8">
          <VideoPlayer src={testVideo.url} poster={testVideo.thumbnail} autoPlay={false} controls title={testVideo.title} />
        </ResponsivePlayerWrapper>
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Using ResponsivePlayerWrapperWithVars (CSS Variables)</h2>
        <ResponsivePlayerWrapper aspectRatio={aspectRatio} maintainAspectRatio={maintainAspect} maxWidth={maxWidth} className="mb-8">
          {/* Using a simple div to represent video */}
          <div className="bg-gray-800 w-full h-full flex items-center justify-center text-white">
            <div className="text-center">
              <p>CSS Variables Version</p>
              <p className="text-sm opacity-70">Aspect Ratio: {aspectRatio}</p>
            </div>
          </div>
        </ResponsivePlayerWrapper>
      </div>

      {/* Script to update window size indicator */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
        function updateWindowWidth() {
          document.getElementById('window-width').textContent = window.innerWidth;
        }
        window.addEventListener('resize', updateWindowWidth);
        updateWindowWidth();
      `,
        }}
      />
    </div>
  );
}
