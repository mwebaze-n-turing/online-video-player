// src/components/common/ThemeToggle.tsx
'use client';

import React, { FC } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  variant?: 'icon' | 'button' | 'switch';
  showLabel?: boolean;
}

export const ThemeToggle: FC<ThemeToggleProps> = ({ className = '', variant = 'icon', showLabel = false }) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Simple icon toggle
  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`
          relative p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2
          focus:ring-offset-gray-100 focus:ring-primary-500 
          transition-colors duration-200
          ${isDark ? 'bg-gray-800 text-yellow-300' : 'bg-gray-200 text-gray-900'}
          ${className}
        `}
        title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        {isDark ? (
          // Sun icon for dark mode
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          // Moon icon for light mode
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
        {showLabel && <span className="ml-2 text-sm font-medium">{isDark ? 'Light' : 'Dark'}</span>}
      </button>
    );
  }

  // Button variant with text
  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`
          inline-flex items-center px-4 py-2 rounded-md
          focus:outline-none focus:ring-2 focus:ring-offset-2
          focus:ring-offset-gray-100 focus:ring-primary-500
          transition-colors duration-200
          ${isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-800 border border-gray-300'}
          ${className}
        `}
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        {isDark ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
        {isDark ? 'Light Mode' : 'Dark Mode'}
      </button>
    );
  }

  // Switch variant
  return (
    <div className={`flex items-center ${className}`}>
      {showLabel && <span className={`mr-3 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{isDark ? 'Dark' : 'Light'}</span>}
      <button
        type="button"
        onClick={toggleTheme}
        className={`
          relative inline-flex flex-shrink-0 h-6 w-11
          border-2 border-transparent rounded-full cursor-pointer
          transition-colors ease-in-out duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
          ${isDark ? 'bg-primary-600' : 'bg-gray-200'}
        `}
        aria-pressed={isDark}
        aria-label="Toggle theme"
      >
        <span className="sr-only">Toggle theme</span>
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 rounded-full
            bg-white shadow transform ring-0 transition ease-in-out duration-200
            ${isDark ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  );
};

export default ThemeToggle;
