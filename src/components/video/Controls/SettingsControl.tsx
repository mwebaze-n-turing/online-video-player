// src/components/video/Controls/SettingsControl.tsx
import React, { useState } from 'react';
import { Cog } from 'your-icon-library';
import ControlButton from './ControlButton';
import SettingsMenu from './SettingsMenu';

interface SettingsControlProps {
  // Any required props
}

const SettingsControl: React.FC<SettingsControlProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative">
      <ControlButton
        icon={Cog}
        className={`w-5 h-5 transition-transform duration-300 ease-in-out ${isMenuOpen ? 'rotate-90' : ''}`}
        label="Settings"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        isActive={isMenuOpen}
      />

      {isMenuOpen && <SettingsMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />}
    </div>
  );
};

export default SettingsControl;
