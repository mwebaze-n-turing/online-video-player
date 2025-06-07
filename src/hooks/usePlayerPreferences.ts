// src/hooks/usePlayerPreferences.ts
import { useState, useEffect } from 'react';
import { 
  PlayerPreferences, 
  defaultPreferences,
  savePreferences, 
  loadPreferences 
} from '@/lib/storage/playerPreferences';

export const usePlayerPreferences = () => {
  const [preferences, setPreferences] = useState<PlayerPreferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from localStorage when component mounts
  useEffect(() => {
    // Use a small timeout to ensure this runs on client-side only
    const timeoutId = setTimeout(() => {
      const loadedPrefs = loadPreferences();
      setPreferences(loadedPrefs);
      setIsLoaded(true);
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Helper functions to update individual preferences
  const updateVolume = (volume: number) => {
    setPreferences(prev => {
      const newPrefs = { ...prev, volume };
      savePreferences(newPrefs);
      return newPrefs;
    });
  };

  const updatePlaybackSpeed = (playbackSpeed: number) => {
    setPreferences(prev => {
      const newPrefs = { ...prev, playbackSpeed };
      savePreferences(newPrefs);
      return newPrefs;
    });
  };

  const updateMuted = (isMuted: boolean) => {
    setPreferences(prev => {
      const newPrefs = { ...prev, isMuted };
      savePreferences(newPrefs);
      return newPrefs;
    });
  };

  return {
    preferences,
    isLoaded,
    updateVolume,
    updatePlaybackSpeed,
    updateMuted
  };
};