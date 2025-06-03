// src/components/video/Controls/SettingsMenu.tsx
import { FC, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export interface PlaybackSpeed {
  label: string;
  value: number;
}

export interface VideoQuality {
  label: string;
  value: string;
  bitrate?: number;
  resolution?: string;
}

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  playbackSpeed: number;
  onPlaybackSpeedChange: (speed: number) => void;
  qualities: VideoQuality[];
  currentQuality: string;
  onQualityChange: (quality: string) => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}

export const SettingsMenu: FC<SettingsMenuProps> = ({
  isOpen,
  onClose,
  playbackSpeed,
  onPlaybackSpeedChange,
  qualities,
  currentQuality,
  onQualityChange,
  position = 'bottom-right',
  className = '',
}) => {
  const { resolvedTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'main' | 'speed' | 'quality'>('main');

  if (!isOpen) return null;

  // Available playback speeds
  const speeds: PlaybackSpeed[] = [
    { label: '0.5x', value: 0.5 },
    { label: '0.75x', value: 0.75 },
    { label: 'Normal', value: 1 },
    { label: '1.25x', value: 1.25 },
    { label: '1.5x', value: 1.5 },
    { label: '1.75x', value: 1.75 },
    { label: '2x', value: 2 },
  ];

  // Get position classes
  const positionClasses = {
    'bottom-right': 'bottom-10 right-4',
    'bottom-left': 'bottom-10 left-4',
    'top-right': 'top-10 right-4',
    'top-left': 'top-10 left-4',
  };

  // Theme-aware styles
  const menuClasses = `
    absolute z-50 rounded-md shadow-lg overflow-hidden
    ${positionClasses[position]}
    ${resolvedTheme === 'dark' ? 'bg-gray-900 text-white border border-gray-700' : 'bg-white text-gray-900 border border-gray-200'}
    ${className}
  `;

  const menuItemClasses = `
    px-4 py-2 text-sm cursor-pointer theme-transition
    flex items-center justify-between
    ${resolvedTheme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}
  `;

  const activeItemClasses = `
    ${resolvedTheme === 'dark' ? 'bg-blue-900 bg-opacity-50' : 'bg-blue-50'}
  `;

  const headerClasses = `
    px-4 py-2 border-b
    ${resolvedTheme === 'dark' ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-200 bg-gray-50 text-gray-900'}
  `;

  const backButtonClasses = `
    mr-2 text-blue-500 
    ${resolvedTheme === 'dark' ? 'hover:text-blue-400' : 'hover:text-blue-600'}
  `;

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'speed':
        return (
          <div>
            <div className={headerClasses}>
              <button className={backButtonClasses} onClick={() => setActiveTab('main')}>
                ← Back
              </button>
              <span className="font-medium">Playback Speed</span>
            </div>
            <div>
              {speeds.map(speed => (
                <div
                  key={speed.value}
                  className={`${menuItemClasses} ${playbackSpeed === speed.value ? activeItemClasses : ''}`}
                  onClick={() => {
                    onPlaybackSpeedChange(speed.value);
                    onClose();
                  }}
                >
                  <span>{speed.label}</span>
                  {playbackSpeed === speed.value && (
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'quality':
        return (
          <div>
            <div className={headerClasses}>
              <button className={backButtonClasses} onClick={() => setActiveTab('main')}>
                ← Back
              </button>
              <span className="font-medium">Quality</span>
            </div>
            <div>
              {qualities.map(quality => (
                <div
                  key={quality.value}
                  className={`${menuItemClasses} ${currentQuality === quality.value ? activeItemClasses : ''}`}
                  onClick={() => {
                    onQualityChange(quality.value);
                    onClose();
                  }}
                >
                  <span>{quality.label}</span>
                  {quality.value === currentQuality && (
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div>
            <div className={headerClasses}>
              <span className="font-medium">Settings</span>
            </div>
            <div>
              <div className={menuItemClasses} onClick={() => setActiveTab('speed')}>
                <span>Playback Speed</span>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                    {playbackSpeed === 1 ? 'Normal' : `${playbackSpeed}x`}
                  </span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className={menuItemClasses} onClick={() => setActiveTab('quality')}>
                <span>Quality</span>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                    {qualities.find(q => q.value === currentQuality)?.label || 'Auto'}
                  </span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={menuClasses} style={{ width: '250px' }}>
      {renderContent()}
    </div>
  );
};

export default SettingsMenu;
