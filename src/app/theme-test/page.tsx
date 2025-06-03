// src/app/theme-test/page.tsx
'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/common/ThemeToggle';
import { VideoPlayer } from '@/components/video/Player';
import { ResponsivePlayerWrapper } from '@/components/video/Player/ResponsivePlayerWrapper';

export default function ThemeTestPage() {
  const { resolvedTheme, theme, setTheme } = useTheme();
  
  const testVideo = {
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    title: 'Big Buck Bunny',
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-theme-primary">Theme Toggle Test</h1>
      
      <div className="mb-12 bg-theme-secondary p-6 rounded-lg border border-theme-light">
        <h2 className="text-xl font-semibold mb-4 text-theme-primary">Current Theme Settings</h2>
        <div className="mb-4">
          <p className="text-theme-secondary mb-1">Selected Theme: <span className="font-semibold">{theme}</span></p>
          <p className="text-theme-secondary mb-1">Resolved Theme (actual): <span className="font-semibold">{resolvedTheme}</span></p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-4 bg-theme-tertiary rounded-lg">
            <h3 className="font-semibold mb-3 text-theme-primary">Icon Toggle</h3>
            <ThemeToggle variant="icon" />
          </div>
          
          <div className="p-4 bg-theme-tertiary rounded-lg">
            <h3 className="font-semibold mb-3 text-theme-primary">Button Toggle</h3>
            <ThemeToggle variant="button" />
          </div>
          
          <div className="p-4 bg-theme-tertiary rounded-lg">
            <h3 className="font-semibold mb-3 text-theme-primary">Switch Toggle</h3>
            <ThemeToggle variant="switch" showLabel={true} />
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="font-semibold mb-3 text-theme-primary">Manual Selection</h3>
          <div className="flex space-x-4">
            <button 
              onClick={() => setTheme('light')}
              className={`px-4 py-2 rounded-md ${theme === 'light' ? 'bg-primary-500 text-white' : 'bg-theme-tertiary text-theme-primary'}`}
            >
              Light
            </button>
            <button 
              onClick={() => setTheme('dark')}
              className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-primary-500 text-white' : 'bg-theme-tertiary text-theme-primary'}`}
            >
              Dark
            </button>
            <button 
              onClick={() => setTheme('system')}
              className={`px-4 py-2 rounded-md ${theme === 'system' ? 'bg-primary-500 text-white' : 'bg-theme-tertiary text-theme-primary'}`}
            >
              System
            </button>
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold mb-6 text-theme-primary">Video Player with Theme Support</h2>
      
      <div className="mb-12">
        <ResponsivePlayerWrapper
          aspectRatio="16:9"
          maintainAspectRatio={true}
          maxWidth="800px"
          className="mb-6"
        >
          <VideoPlayer 
            src={testVideo.url} 
            poster={testVideo.thumbnail}
            autoPlay={false}
            controls
            title={testVideo.title}
          />
        </ResponsivePlayerWrapper>
        
        <div className="w-full sm:w-[90%] mx-auto" style={{ maxWidth: '800px' }}>
          <h3 className="text-xl font-semibold mb-2 text-theme-primary">{testVideo.title}</h3>
          <p className="text-theme-secondary mb-4">
            This video player uses theme-aware styling to maintain consistent appearance in both light and dark modes.
            The controls adapt to the current theme and maintain proper contrast.
          </p>
        </div>
      </div>
      
      <div className="mb-12 bg-theme-secondary p-6 rounded-lg border border-theme-light">
        <h2 className="text-xl font-semibold mb-4 text-theme-primary">Theme-Aware Components</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-theme-primary p-4 rounded-lg border border-theme-light">
            <h3 className="font-semibold mb-3 text-theme-primary">Primary Background</h3>
            <p className="text-theme-secondary">Text with secondary color</p>
            <p className="text-theme-tertiary">Text with tertiary color</p>
          </div>
          
          <div className="bg-theme-secondary p-4 rounded-lg border border-theme-light">
            <h3 className="font-semibold mb-3 text-theme-primary">Secondary Background</h3>
            <p className="text-theme-secondary">Text with secondary color</p>
            <p className="text-theme-tertiary">Text with tertiary color</p>
          </div>
          
          <div className="bg-theme-tertiary p-4 rounded-lg border border-theme-light">
            <h3 className="font-semibold mb-3 text-theme-primary">Tertiary Background</h3>
            <p className="text-theme-secondary">Text with secondary color</p>
            <p className="text-theme-tertiary">Text with tertiary color</p>
          </div>
          
          <div className="bg-primary-500 p-4 rounded-lg text-white">
            <h3 className="font-semibold mb-3">Primary Brand Color</h3>
            <p>This color stays consistent across themes</p>
            <button className="mt-2 px-3 py-1 bg-white text-primary-700 rounded">
              Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}