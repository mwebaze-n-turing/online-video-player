import React, { useEffect, useState } from 'react';
import { 
  VolumeX,
  Volume,
  Volume1,
  Volume2
} from 'lucide-react';

interface VolumeControlProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ videoRef }) => {
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Load volume settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedVolume = localStorage.getItem('videoPlayerVolume');
      const savedMuted = localStorage.getItem('videoPlayerMuted');
      
      if (savedVolume !== null && !isNaN(parseFloat(savedVolume))) {
        const parsedVolume = Math.min(Math.max(parseFloat(savedVolume), 0), 1);
        setVolume(parsedVolume);
        if (videoRef.current) {
          videoRef.current.volume = parsedVolume;
        }
      }
      
      if (savedMuted !== null) {
        const parsedMuted = savedMuted === 'true';
        setIsMuted(parsedMuted);
        if (videoRef.current) {
          videoRef.current.muted = parsedMuted;
        }
      }
    } catch (error) {
      console.warn('Error loading volume settings:', error);
    }
  }, [videoRef]);

  // Save settings to localStorage
  const saveSettings = (newVolume: number, newMuted: boolean) => {
    try {
      localStorage.setItem('videoPlayerVolume', newVolume.toString());
      localStorage.setItem('videoPlayerMuted', newMuted.toString());
    } catch (error) {
      console.warn('Error saving volume settings:', error);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    videoRef.current.muted = newMutedState;
    saveSettings(volume, newMutedState);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    
    let newMutedState = isMuted;
    if (newVolume === 0 && !isMuted) {
      newMutedState = true;
      setIsMuted(true);
      videoRef.current.muted = true;
    } else if (newVolume > 0 && isMuted) {
      newMutedState = false;
      setIsMuted(false);
      videoRef.current.muted = false;
    }
    
    saveSettings(newVolume, newMutedState);
  };

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
            '--volume-level': `${volume * 100}%`
          } as React.CSSProperties}
        />
      </div>
    </div>
  );
};

export default VolumeControl;
