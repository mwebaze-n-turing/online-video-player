'use client';

import React from 'react';
import ProgressBar from './ProgressBar';

interface ControlBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

const ControlBar: React.FC<ControlBarProps> = ({ currentTime, duration, onSeek }) => {
  return (
    <div className="control-bar w-full px-4 py-2 bg-black/60 text-white flex flex-col gap-2">
      {/* Top section: ProgressBar */}
      <ProgressBar currentTime={currentTime} duration={duration} onSeek={onSeek} demonstration={true} />

      {/* Bottom section: Placeholder for control buttons */}
      <div className="flex justify-between items-center text-sm">
        <button className="px-2 py-1 hover:bg-white/10 rounded">⏯ Play</button>
        <span className="font-mono">
          {Math.floor(currentTime)} / {Math.floor(duration)}s
        </span>
        <button className="px-2 py-1 hover:bg-white/10 rounded">⚙️ Settings</button>
      </div>
    </div>
  );
};

export default ControlBar;
