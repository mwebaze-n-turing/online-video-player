// src/components/video/Controls/FullscreenControl.tsx
import React, { useState, useEffect } from 'react';
import { Expand, Compress } from 'your-icon-library';
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

  return (
    <ControlButton
      icon={Expand}
      className="w-5 h-5"
      activeIcon={Compress}
      isActive={isFullscreen}
      label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      onClick={handleClick}
    />
  );
};

export default FullscreenControl;
