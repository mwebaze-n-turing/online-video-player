// src/components/video/Controls/FullscreenControl.tsx
import React, { useState, useEffect } from 'react';
import ControlButton from './ControlButton';

interface FullscreenControlProps {
  onFullscreenToggle: () => void;
}

const FullscreenControl: React.FC<FullscreenControlProps> = ({ onFullscreenToggle }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Check fullscreen state when it changes through other means
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleClick = () => {
    onFullscreenToggle();
    setIsFullscreen(!isFullscreen);
  };

  // Hardcoded SVG icons
  const ExpandIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
  );

  const CompressIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M9 9a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
      <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm1.707 6.707L9 5.414V7a1 1 0 102 0V4a1 1 0 00-1-1H7a1 1 0 000 2h1.586L5.293 8.293a1 1 0 101.414 1.414zm5.586 2.586L14.586 15H13a1 1 0 100 2h3a1 1 0 001-1v-3a1 1 0 10-2 0v1.586l-3.293-3.293a1 1 0 00-1.414 1.414z" clipRule="evenodd" />
    </svg>
  );

  return (
    <ControlButton
      icon={<ExpandIcon />}
      activeIcon={<CompressIcon />}
      isActive={isFullscreen}
      label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      onClick={handleClick}
    />
  );
};

export default FullscreenControl;
