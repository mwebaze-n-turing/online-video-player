// src/contexts/ThemeContext.tsx
'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system';

// Theme context interface
interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark'; // The actual applied theme after resolving 'system'
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

// Default context value
const defaultContext: ThemeContextType = {
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
};

// Create context
const ThemeContext = createContext<ThemeContextType>(defaultContext);

// Local storage key for theme
const THEME_STORAGE_KEY = 'video-player-theme-preference';

// Parse theme from storage or return default
const getStoredTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'system';

  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
      return storedTheme;
    }
  } catch (error) {
    console.error('Error accessing localStorage:', error);
  }

  return 'system';
};

// Provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Initialize theme from storage
  useEffect(() => {
    const savedTheme = getStoredTheme();
    setThemeState(savedTheme);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      if (theme === 'system') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };

    // Initial check
    handleChange();

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  // Update resolved theme when theme changes
  useEffect(() => {
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setResolvedTheme(prefersDark ? 'dark' : 'light');
    } else {
      setResolvedTheme(theme === 'dark' ? 'dark' : 'light');
    }
  }, [theme]);

  // Apply theme to document
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Remove both classes first
    document.documentElement.classList.remove('light-theme', 'dark-theme');

    // Add the correct class
    document.documentElement.classList.add(resolvedTheme === 'dark' ? 'dark-theme' : 'light-theme');

    // Also set data-theme attribute for components that rely on it
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }, [resolvedTheme]);

  // Set theme and save to storage
  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Error saving theme to localStorage:', error);
    }
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    if (resolvedTheme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

export default ThemeContext;
