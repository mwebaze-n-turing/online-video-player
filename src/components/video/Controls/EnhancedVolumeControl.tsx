// EnhancedVolumeControl.tsx
import { useState, useRef, useEffect } from 'react';

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMuteToggle: () => void;
}

export default function EnhancedVolumeControl({ volume, isMuted, onVolumeChange, onMuteToggle }: VolumeControlProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [showVolumePercentage, setShowVolumePercentage] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Convert volume from 0-1 scale to percentage
  const volumePercentage = Math.round((isMuted ? 0 : volume) * 100);
  
  // Show percentage briefly when volume changes
  useEffect(() => {
    setShowVolumePercentage(true);
    const timer = setTimeout(() => setShowVolumePercentage(false), 1500);
    return () => clearTimeout(timer);
  }, [volume, isMuted]);

  // Handle clicking outside to close the volume slider
  useEffect(() => {
    if (!isHovering) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsHovering(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isHovering]);

  return (
    <div 
      ref={containerRef}
      className="relative flex items-center"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Volume Icon Button */}
      <button
        onClick={onMuteToggle}
        className="group relative flex items-center justify-center w-9 h-9 rounded-full bg-black/50 hover:bg-gray-800/80 active:bg-gray-700/90 transition-all duration-150 hover:scale-110 active:scale-90 focus:outline-none focus:ring-2 focus:ring-white/50 z-10"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {/* Dynamic volume icon based on state */}
        {isMuted || volume === 0 ? (
          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
            <path d="M16.5 12c0-1.8-1-3.3-2.5-4v2.2l2.5 2.4c0-.2 0-.4 0-.6zm2.5 0c0 .9-.2 1.8-.5 2.6l1.5 1.5c.5-1.3.8-2.6.8-4.1 0-4.3-3-7.9-7-8.8v2.1c2.9.9 5 3.5 5 6.7zM4.3 3L3 4.3 7.7 9H3v6h4l5 5v-6.7l4.2 4.2c-.7.6-1.6 1-2.5 1.2v2.1c1.4-.3 2.6-.9 3.7-1.8l2 2 1.3-1.3-13-13c.1 0 .1 0 0 0zM12 4l-1.6 1.6L12 7.3V4z" />
          </svg>
        ) : volume > 0.5 ? (
          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.8-1-3.3-2.5-4v8c1.5-.7 2.5-2.2 2.5-4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.8-1-3.3-2.5-4v8c1.5-.7 2.5-2.2 2.5-4zM14 3.2v2.1c2.9.9 5 3.5 5 6.7s-2.1 5.8-5 6.7v2.1c4-.9 7-4.5 7-8.8s-3-7.9-7-8.8z" />
          </svg>
        )}
        
        {/* Volume percentage tooltip */}
        {showVolumePercentage && (
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded animate-fade-in whitespace-nowrap">
            {volumePercentage}%
          </span>
        )}
      </button>
      
      {/* Expandable Volume Slider */}
      <div
        className={`absolute left-7 h-9 flex items-center bg-black/70 rounded-full px-3 py-1.5 origin-left transition-all duration-300 ${
          isHovering 
            ? "opacity-100 w-32 scale-100" 
            : "opacity-0 w-0 scale-95 pointer-events-none"
        }`}
      >
        {/* Current volume percentage label */}
        <span className="text-white text-xs font-mono w-8 text-right mr-2">
          {volumePercentage}%
        </span>
        
        {/* Slider Track & Thumb */}
        <div className="relative w-full h-1.5 bg-white/30 rounded-full overflow-hidden">
          {/* Volume level indicator */}
          <div 
            className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
            style={{ width: `${volumePercentage}%` }}
          />
          
          {/* Range Input */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={onVolumeChange}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Volume"
          />
          
          {/* Custom Thumb */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md transition-all duration-100 hover:scale-125"
            style={{ left: `calc(${volumePercentage}% - 6px)` }}
          />
        </div>
      </div>
    </div>
  );
}