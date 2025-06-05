// app/enhanced-player/page.tsx
'use client';

import { useState } from 'react';
import EnhancedVideoPlayer from '@/components/video/Player/EnhancedVideoPlayer';

export default function EnhancedPlayerPage() {
  const [selectedVideo, setSelectedVideo] = useState('/videos/featured.mp4');
  
  const videoOptions = [
    { value: '/videos/featured.mp4', label: 'Featured Video' },
    // Add more video options as needed
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Enhanced Video Player</h1>
        
        {/* Video Selection */}
        <div className="mb-6 flex justify-center">
          <div className="flex items-center space-x-4">
            <label htmlFor="video-select" className="text-sm font-medium">
              Select Video:
            </label>
            <select
              id="video-select"
              value={selectedVideo}
              onChange={(e) => setSelectedVideo(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {videoOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Enhanced Video Player */}
        <div className="max-w-4xl mx-auto">
          <EnhancedVideoPlayer
            videoUrl={selectedVideo}
            posterUrl="/thumbnails/featured-thumb.jpg"
            initialVolume={0.7}
            className="rounded-lg shadow-2xl"
          />
        </div>

        {/* Features List */}
        <div className="max-w-4xl mx-auto mt-12">
          <h2 className="text-2xl font-bold mb-6">Enhanced Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-blue-400">🎮 Interactive Controls</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Click to play/pause</li>
                <li>• Double-click for fullscreen</li>
                <li>• Animated control buttons</li>
                <li>• Auto-hide controls during playback</li>
                <li>• Smooth hover animations</li>
              </ul>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-green-400">⌨️ Keyboard Shortcuts</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• <kbd className="bg-gray-700 px-1 rounded">Space</kbd> or <kbd className="bg-gray-700 px-1 rounded">K</kbd> - Play/Pause</li>
                <li>• <kbd className="bg-gray-700 px-1 rounded">F</kbd> - Toggle fullscreen</li>
                <li>• <kbd className="bg-gray-700 px-1 rounded">M</kbd> - Mute/Unmute</li>
                <li>• <kbd className="bg-gray-700 px-1 rounded">←</kbd> - Rewind 10s</li>
                <li>• <kbd className="bg-gray-700 px-1 rounded">→</kbd> - Forward 10s</li>
              </ul>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-purple-400">🔊 Enhanced Volume</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Expandable volume slider</li>
                <li>• Real-time percentage display</li>
                <li>• Dynamic volume icons</li>
                <li>• Temporary change feedback</li>
                <li>• Click outside to close</li>
              </ul>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-orange-400">🎬 Advanced Features</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Variable playback speeds</li>
                <li>• Cross-browser fullscreen</li>
                <li>• Progress bar with tooltips</li>
                <li>• Buffering indicator</li>
                <li>• Settings menu preparation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="max-w-4xl mx-auto mt-12 bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-400">🚀 How to Use</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-300">
            <div>
              <h4 className="font-semibold mb-2">Basic Controls:</h4>
              <ul className="space-y-1">
                <li>1. Click the play button or video to start</li>
                <li>2. Hover over controls to see tooltips</li>
                <li>3. Use progress bar to seek</li>
                <li>4. Adjust volume by hovering volume icon</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Advanced Usage:</h4>
              <ul className="space-y-1">
                <li>1. Click speed button for playback rates</li>
                <li>2. Double-click video for fullscreen</li>
                <li>3. Use keyboard shortcuts for quick control</li>
                <li>4. Controls auto-hide during playback</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}