// src/lib/storage/playerPreferences.ts
const STORAGE_KEY = 'video_player_preferences';

export interface PlayerPreferences {
  volume: number;        // 0-1 range
  playbackSpeed: number; // Typically 0.5, 1, 1.25, 1.5, 2
  isMuted: boolean;      // Whether audio is muted
}

export const defaultPreferences: PlayerPreferences = {
  volume: 1,
  playbackSpeed: 1,
  isMuted: false,
};

// Check if localStorage is available (handles SSR and privacy mode)
const isStorageAvailable = (): boolean => {
  try {
    const testKey = 'test_storage';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    console.warn('localStorage is not available');
    return false;
  }
};

export const savePreferences = (prefs: PlayerPreferences): void => {
  if (!isStorageAvailable()) return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (error) {
    console.error('Failed to save preferences:', error);
  }
};

export const loadPreferences = (): PlayerPreferences => {
  if (!isStorageAvailable()) return defaultPreferences;
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultPreferences;
    
    const parsedPrefs = JSON.parse(saved) as Partial<PlayerPreferences>;
    
    // Merge with defaults to ensure all required properties exist
    return {
      ...defaultPreferences,
      ...parsedPrefs,
    };
  } catch (error) {
    console.error('Failed to load preferences:', error);
    return defaultPreferences;
  }
};