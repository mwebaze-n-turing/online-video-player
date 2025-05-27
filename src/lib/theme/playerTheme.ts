// src/lib/theme/playerTheme.ts

export type PlayerTheme = {
  background: string;
  surface: string;
  controls: {
    default: string;
    hover: string;
    active: string;
  };
  progress: {
    background: string;
    filled: string;
    buffered: string;
  };
  overlay: {
    dark: string;
    darker: string;
    gradient: string;
  };
};

export const defaultPlayerTheme: PlayerTheme = {
  background: '#0f0f0f',
  surface: '#1a1a1a',
  controls: {
    default: 'rgba(255, 255, 255, 0.8)',
    hover: '#ffffff',
    active: '#3b82f6',
  },
  progress: {
    background: 'rgba(255, 255, 255, 0.2)',
    filled: '#3b82f6',
    buffered: 'rgba(255, 255, 255, 0.4)',
  },
  overlay: {
    dark: 'rgba(0, 0, 0, 0.6)',
    darker: 'rgba(0, 0, 0, 0.8)',
    gradient: 'rgba(0, 0, 0, 0.5)',
  },
};

// Dark blue theme variant
export const darkBluePlayerTheme: PlayerTheme = {
  background: '#0a192f',
  surface: '#112240',
  controls: {
    default: 'rgba(255, 255, 255, 0.8)',
    hover: '#ffffff',
    active: '#64ffda',
  },
  progress: {
    background: 'rgba(255, 255, 255, 0.2)',
    filled: '#64ffda',
    buffered: 'rgba(255, 255, 255, 0.4)',
  },
  overlay: {
    dark: 'rgba(10, 25, 47, 0.6)',
    darker: 'rgba(10, 25, 47, 0.8)',
    gradient: 'rgba(10, 25, 47, 0.5)',
  },
};

// Modern dark theme variant
export const modernDarkPlayerTheme: PlayerTheme = {
  background: '#121212',
  surface: '#1e1e1e',
  controls: {
    default: 'rgba(255, 255, 255, 0.8)',
    hover: '#ffffff',
    active: '#bb86fc',
  },
  progress: {
    background: 'rgba(255, 255, 255, 0.2)',
    filled: '#bb86fc',
    buffered: 'rgba(255, 255, 255, 0.4)',
  },
  overlay: {
    dark: 'rgba(18, 18, 18, 0.6)',
    darker: 'rgba(18, 18, 18, 0.8)',
    gradient: 'rgba(18, 18, 18, 0.5)',
  },
};

// Apply theme to CSS variables
export function applyPlayerTheme(theme: PlayerTheme): void {
  const root = document.documentElement;

  // Set CSS variables
  root.style.setProperty('--player-bg', theme.background);
  root.style.setProperty('--player-surface', theme.surface);
  root.style.setProperty('--control-default', theme.controls.default);
  root.style.setProperty('--control-hover', theme.controls.hover);
  root.style.setProperty('--control-active', theme.controls.active);
  root.style.setProperty('--progress-bg', theme.progress.background);
  root.style.setProperty('--progress-filled', theme.progress.filled);
  root.style.setProperty('--progress-buffered', theme.progress.buffered);
  root.style.setProperty('--overlay-dark', theme.overlay.dark);
  root.style.setProperty('--overlay-darker', theme.overlay.darker);
  root.style.setProperty('--overlay-gradient', theme.overlay.gradient);
}
