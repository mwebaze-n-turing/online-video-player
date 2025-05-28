// src/app/admin/config/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useConfig } from '@/hooks/useConfig';

export default function ConfigAdminPage(): JSX.Element {
  const config = useConfig();
  const [localConfig, setLocalConfig] = useState({
    features: { ...config.features },
    player: { ...config.player },
  });

  // Apply runtime configuration changes
  const updateConfiguration = (section: 'features' | 'player', key: string, value: any) => {
    // Update local state
    setLocalConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));

    // Save to localStorage for persistence
    const storedConfig = JSON.parse(localStorage.getItem('app_config') || '{}');
    localStorage.setItem(
      'app_config',
      JSON.stringify({
        ...storedConfig,
        [section]: {
          ...(storedConfig[section] || {}),
          [key]: value,
        },
      })
    );

    // Update runtime config (this would be more sophisticated in a real app)
    if (section === 'features') {
      (config.features as any)[key] = value;
    } else if (section === 'player') {
      (config.player as any)[key] = value;
    }
  };

  // Load saved configuration from localStorage
  useEffect(() => {
    const storedConfig = JSON.parse(localStorage.getItem('app_config') || '{}');

    if (storedConfig.features) {
      setLocalConfig(prev => ({
        ...prev,
        features: {
          ...prev.features,
          ...storedConfig.features,
        },
      }));

      // Apply to runtime config
      Object.entries(storedConfig.features).forEach(([key, value]) => {
        (config.features as any)[key] = value;
      });
    }

    if (storedConfig.player) {
      setLocalConfig(prev => ({
        ...prev,
        player: {
          ...prev.player,
          ...storedConfig.player,
        },
      }));

      // Apply to runtime config
      Object.entries(storedConfig.player).forEach(([key, value]) => {
        (config.player as any)[key] = value;
      });
    }
  }, [config]);

  return (
    <div>
      <h1>Configuration Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Feature Flags Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2>Feature Flags</h2>
          <div className="space-y-4">
            {Object.entries(localConfig.features).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label>{key}</label>
                <div className="relative inline-block w-12 h-6">
                  <input
                    type="checkbox"
                    id={`feature-${key}`}
                    className="hidden"
                    checked={Boolean(value)}
                    onChange={e => updateConfiguration('features', key, e.target.checked)}
                  />
                  <label>
                    <span
                      className={`block h-6 w-6 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
                        Boolean(value) ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Player Configuration Section */}
        <div>
          <h2>Player Settings</h2>
          <div className="space-y-4">
            {/* Volume control */}
            <div className="space-y-1">
              <label>Default Volume: {localConfig.player.defaultVolume.toFixed(1)}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={localConfig.player.defaultVolume}
                onChange={e => updateConfiguration('player', 'defaultVolume', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            {/* Autoplay toggle */}
            <div>
              <label>Autoplay</label>
              <div className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  id="player-autoplay"
                  className="hidden"
                  checked={Boolean(localConfig.player.autoplay)}
                  onChange={e => updateConfiguration('player', 'autoplay', e.target.checked)}
                />
                <label>
                  <span
                    className={`block h-6 w-6 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
                      Boolean(localConfig.player.autoplay) ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </label>
              </div>
            </div>

            {/* Default quality selection */}
            <div>
              <label>Default Quality</label>
              <select
                onChange={e => updateConfiguration('player', 'defaultQuality', e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-md"
              >
                <option>Auto</option>
                <option>1080p</option>
                <option>720p</option>
                <option>480p</option>
                <option>360p</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Environment Information */}
      <div>
        <h2>Environment Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p>
              <strong>App Name:</strong>
              {config.app.name}
            </p>
            <p>
              <strong>Version:</strong>
              {config.app.version}
            </p>
            <p>
              <strong>Environment:</strong>
              {config.app.environment}
            </p>
            <p>
              <strong>Base URL:</strong>
              {config.app.baseUrl}
            </p>
          </div>
          <div>
            <p>
              <strong>API Base URL:</strong>
              {config.api.baseUrl}
            </p>
            <p>
              <strong>CDN URL:</strong>
              {config.cdn.baseUrl}
            </p>
            <p>
              <strong>Video CDN:</strong>
              {config.cdn.videoUrl}
            </p>
            <p>
              <strong>Thumbnail CDN:</strong>
              {config.cdn.thumbnailUrl}
            </p>
          </div>
        </div>

        {/* Browser Capabilities */}
        <h3>Browser Capabilities</h3>
        <div>
          {Object.entries(config.runtime.capabilities).map(([key, value]) => (
            <div key={key} className="flex items-center">
              <span>
                <span className="text-sm">{key}:</span> {value ? 'Yes' : 'No'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
