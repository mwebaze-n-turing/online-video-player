'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PlayerTheme, defaultPlayerTheme, applyPlayerTheme } from '@/lib/theme/playerTheme';

type ThemeContextType = {
  theme: PlayerTheme;
  setTheme: (theme: PlayerTheme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }): JSX.Element {
  const [theme, setTheme] = useState<PlayerTheme>(defaultPlayerTheme);

  useEffect(() => {
    // Apply theme to CSS variables when theme changes
    applyPlayerTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}