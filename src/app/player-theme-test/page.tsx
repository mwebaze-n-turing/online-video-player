// src/app/player-theme-test/page.tsx
'use client';

import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/common/ThemeToggle';
import VideoPlayerContainer from '@/components/video/Player/VideoPlayerContainer';

export default function PlayerThemeTestPage() {
  const { resolvedTheme } = useTheme();

  // Test video data
  const testVideo = {
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    title: 'Big Buck Bunny',
    description: 'Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself.',
  };

  // Example quality options
  const qualities = [
    { label: 'Auto', value: 'auto' },
    { label: '1080p HD', value: '1080p', resolution: '1920x1080', bitrate: 5000000 },
    { label: '720p HD', value: '720p', resolution: '1280x720', bitrate: 2500000 },
    { label: '480p', value: '480p', resolution: '854x480', bitrate: 1000000 },
    { label: '360p', value: '360p', resolution: '640x360', bitrate: 500000 },
    { label: '240p', value: '240p', resolution: '426x240', bitrate: 250000 },
  ];

  return (
    <div className={`min-h-screen ${resolvedTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} theme-transition`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Video Player Theme Test</h1>

          <div className="flex items-center space-x-4">
            <span className={resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              Current theme: <span className="font-medium">{resolvedTheme}</span>
            </span>
            <ThemeToggle variant="switch" showLabel />
          </div>
        </div>

        <div className="mb-8">
          <p className={`mb-4 ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            This page demonstrates how video player components dynamically respond to theme changes. Toggle between light and dark themes to
            see all components update their appearance.
          </p>
        </div>

        {/* Video player with full custom controls */}
        <div className="mb-12">
          <h2 className={`text-2xl font-semibold mb-6 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Video Player with Custom Controls
          </h2>

          <VideoPlayerContainer
            src={testVideo.url}
            poster={testVideo.thumbnail}
            title={testVideo.title}
            aspectRatio="16:9"
            qualities={qualities}
          />

          <div className="mt-6">
            <h3 className={`text-xl font-medium mb-2 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{testVideo.title}</h3>
            <p className={resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{testVideo.description}</p>
          </div>
        </div>

        <div
          className={`p-6 rounded-lg ${
            resolvedTheme === 'dark'
              ? 'bg-gray-800 text-white border border-gray-700'
              : 'bg-white text-gray-800 border border-gray-200 shadow-md'
          }`}
        >
          <h2 className="text-xl font-semibold mb-4">Theme-Responsive Components</h2>
          <p className="mb-4">
            The video player components use the ThemeContext to determine their styling, automatically adjusting colors, gradients, and
            contrast levels based on the current theme.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="font-medium mb-2">Components Using Theme Context:</h3>
              <ul className={`list-disc pl-5 ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>VideoPlayer - Base video component with theme awareness</li>
                <li>ControlBar - Custom controls that adapt to theme</li>
                <li>SettingsMenu - Settings panel with theme-specific styling</li>
                <li>PlayerLoader - Loading states with theme-aware visuals</li>
                <li>VideoPlayerContainer - Container that ties everything together</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">Themeable Elements:</h3>
              <ul className={`list-disc pl-5 ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>Background colors and gradients</li>
                <li>Text and icon colors</li>
                <li>Border colors and shadows</li>
                <li>Progress bars and interactive elements</li>
                <li>Hover and focus states</li>
                <li>Overlay opacities and blurs</li>
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={() => {
                const theme = resolvedTheme === 'dark' ? 'light' : 'dark';
                document.documentElement.classList.remove('light-theme', 'dark-theme');
                document.documentElement.classList.add(`${theme}-theme`);
              }}
              className={`
                px-4 py-2 rounded-md transition-colors
                ${resolvedTheme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}
              `}
            >
              Toggle Theme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
