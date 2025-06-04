import React, { useEffect, useState } from 'react';
import { 
  VolumeX, // Muted icon
  Volume, // Low volume icon
  Volume1, // Medium volume icon
  Volume2 // High volume icon
} from 'lucide-react'; // Assuming use of Lucide icons based on modern practices

interface VolumeControlProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ videoRef }) => {
  // State for volume level (0 to 1) and muted state
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Load volume settings from localStorage on component mount
  useEffect(() => {
    const savedVolume = localStorage.getItem('videoPlayerVolume');
    const savedMuted = localStorage.getItem('videoPlayerMuted');
    
    // Apply saved volume if available
    if (savedVolume !== null) {
      const parsedVolume = parseFloat(savedVolume);
      setVolume(parsedVolume);
      if (videoRef.current) {
        videoRef.current.volume = parsedVolume;
      }
    }
    
    // Apply saved muted state if available
    if (savedMuted !== null) {
      const parsedMuted = savedMuted === 'true';
      setIsMuted(parsedMuted);
      if (videoRef.current) {
        videoRef.current.muted = parsedMuted;
      }
    }
  }, [videoRef]);

  // Toggle between muted and unmuted states
  const toggleMute = () => {
    if (!videoRef.current) return;
    
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    videoRef.current.muted = newMutedState;
    
    // Save to localStorage
    localStorage.setItem('videoPlayerMuted', newMutedState.toString());
  };

  // Handle volume change from input slider
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    
    // If volume is set to 0, mute the video
    if (newVolume === 0 && !isMuted) {
      setIsMuted(true);
      videoRef.current.muted = true;
    } 
    // If volume is increased from 0 and was muted, unmute
    else if (newVolume > 0 && isMuted) {
      setIsMuted(false);
      videoRef.current.muted = false;
    }
    
    // Save to localStorage
    localStorage.setItem('videoPlayerVolume', newVolume.toString());
    localStorage.setItem('videoPlayerMuted', videoRef.current.muted.toString());
  };

  // Determine which icon to display based on volume and muted state
const renderVolumeIcon = () => {
  if (isMuted || volume === 0) {
    return <VolumeX className="volume-icon" />;
  } else if (volume <= 0.33) {
    return <Volume className="volume-icon" />;
  } else if (volume <= 0.66) {
    return <Volume1 className="volume-icon" />;
  } else {
    return <Volume2 className="volume-icon" />;
  }
};

return (
  <div className="volume-control-container">
    <button 
      className="volume-button"
      onClick={toggleMute}
      aria-label={isMuted ? "Unmute" : "Mute"}
    >
      {renderVolumeIcon()}
    </button>
    
    <div className="volume-slider-container">
      <input
        type="range"
        className="volume-slider"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        aria-label="Volume"
        style={{
          // Use CSS variables for dynamic styling based on volume level
          '--volume-level': `${volume * 100}%`
        } as React.CSSProperties}
      />
    </div>
  </div>
  );
};

export default VolumeControl;
