/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';
const videoPlayerPlugins = require('./src/lib/tailwind/videoPlayerPlugins');

module.exports = {
  content: ['./src/app/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}', './src/contexts/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Color palette optimized for video player UI
      colors: {
        player: {
          bg: '#0f0f0f',
          surface: '#1a1a1a',
          control: {
            default: 'rgba(255, 255, 255, 0.8)',
            hover: '#ffffff',
            active: '#3b82f6',
          },
          progress: {
            bg: 'rgba(255, 255, 255, 0.2)',
            filled: '#3b82f6',
            buffered: 'rgba(255, 255, 255, 0.4)',
          },
          overlay: {
            dark: 'rgba(0, 0, 0, 0.6)',
            darker: 'rgba(0, 0, 0, 0.8)',
            gradient: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },

      // Z-index scale for player elements
      zIndex: {
        'player-base': '10',
        'player-controls': '20',
        'player-overlay': '30',
        'player-modal': '40',
      },

      // Custom animation timings for player interactions
      transitionDuration: {
        250: '250ms',
        400: '400ms',
      },

      transitionTimingFunction: {
        'player-ease': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },

      // Custom spacing specifically for player UI
      spacing: {
        'control-sm': '28px',
        'control-md': '36px',
        'control-lg': '48px',
        'control-spacing': '8px',
        'control-padding': '12px',
        'timeline-height': '4px',
        'timeline-height-hover': '6px',
      },

      // Aspect ratios for different video formats
      aspectRatio: {
        'video-standard': '4/3',
        'video-widescreen': '16/9',
        'video-cinema': '21/9',
        'video-vertical': '9/16',
        'video-square': '1/1',
      },

      // Shadow styles for controls
      boxShadow: {
        control: '0 2px 6px rgba(0, 0, 0, 0.3)',
        'control-lg': '0 4px 12px rgba(0, 0, 0, 0.5)',
      },

      // Custom border radius for player elements
      borderRadius: {
        control: '4px',
      },

      // Animation keyframes for player controls
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'scale-up': {
          '0%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
        'progress-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'fade-in': 'fade-in 250ms var(--tw-transition-timing-function-player-ease)',
        'fade-out': 'fade-out 250ms var(--tw-transition-timing-function-player-ease)',
        'scale-up': 'scale-up 250ms var(--tw-transition-timing-function-player-ease)',
        'progress-pulse': 'progress-pulse 2s infinite',
      },
    },
  },
  plugins: [
    // Custom plugin for video player specific utilities
    plugin(function ({ addComponents, addUtilities, theme }) {
      // Control overlay gradients
      const overlayGradients = {
        '.player-overlay-bottom': {
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%)',
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          height: '120px',
          pointerEvents: 'none',
        },
        '.player-overlay-top': {
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%)',
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '120px',
          pointerEvents: 'none',
        },
        '.player-overlay-full': {
          background: 'rgba(0, 0, 0, 0.4)',
          position: 'absolute',
          inset: '0',
          pointerEvents: 'none',
        },
      };

      // Control visibility utilities
      const controlVisibility = {
        '.control-fade-in': {
          opacity: '0',
          transition: 'opacity 250ms cubic-bezier(0.25, 0.1, 0.25, 1)',
          '&:hover, &.active': {
            opacity: '1',
          },
        },
        '.control-fade-in-fast': {
          opacity: '0',
          transition: 'opacity 150ms cubic-bezier(0.25, 0.1, 0.25, 1)',
          '&:hover, &.active': {
            opacity: '1',
          },
        },
        '.control-visibility-group': {
          '& .control-visible-on-hover': {
            opacity: '0',
            transition: 'opacity 250ms cubic-bezier(0.25, 0.1, 0.25, 1)',
          },
          '&:hover .control-visible-on-hover': {
            opacity: '1',
          },
        },
      };

      // Video timeline specific styles
      const timelineComponents = {
        '.player-timeline': {
          position: 'relative',
          height: theme('spacing.timeline-height'),
          background: theme('colors.player.progress.bg'),
          borderRadius: theme('borderRadius.full'),
          cursor: 'pointer',
          transition: 'height 150ms cubic-bezier(0.25, 0.1, 0.25, 1)',
          '&:hover': {
            height: theme('spacing.timeline-height-hover'),
          },
        },
        '.player-timeline-progress': {
          position: 'absolute',
          height: '100%',
          background: theme('colors.player.progress.filled'),
          borderRadius: theme('borderRadius.full'),
          pointerEvents: 'none',
        },
        '.player-timeline-buffered': {
          position: 'absolute',
          height: '100%',
          background: theme('colors.player.progress.buffered'),
          borderRadius: theme('borderRadius.full'),
          pointerEvents: 'none',
        },
        '.player-timeline-thumb': {
          position: 'absolute',
          height: '12px',
          width: '12px',
          borderRadius: '50%',
          background: theme('colors.player.progress.filled'),
          transform: 'translate(-50%, -50%)',
          top: '50%',
          pointerEvents: 'none',
          opacity: '0',
          transition: 'opacity 150ms cubic-bezier(0.25, 0.1, 0.25, 1)',
          '.player-timeline:hover &': {
            opacity: '1',
          },
        },
        '.player-timeline-hover': {
          position: 'absolute',
          top: '-40px',
          transform: 'translateX(-50%)',
          background: theme('colors.player.overlay.darker'),
          color: theme('colors.white'),
          padding: '4px 8px',
          borderRadius: theme('borderRadius.md'),
          fontSize: theme('fontSize.xs'),
          pointerEvents: 'none',
          opacity: '0',
          transition: 'opacity 150ms cubic-bezier(0.25, 0.1, 0.25, 1)',
          '.player-timeline:hover &': {
            opacity: '1',
          },
        },
      };

      // Video control buttons
      const controlComponents = {
        '.player-control-button': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme('colors.player.control.default'),
          borderRadius: theme('borderRadius.full'),
          transition: 'all 150ms cubic-bezier(0.25, 0.1, 0.25, 1)',
          '&:hover': {
            color: theme('colors.player.control.hover'),
            background: 'rgba(255, 255, 255, 0.1)',
          },
          '&:active': {
            transform: 'scale(0.97)',
          },
          '&.active': {
            color: theme('colors.player.control.active'),
          },
        },
        '.player-control-sm': {
          width: theme('spacing.control-sm'),
          height: theme('spacing.control-sm'),
        },
        '.player-control-md': {
          width: theme('spacing.control-md'),
          height: theme('spacing.control-md'),
        },
        '.player-control-lg': {
          width: theme('spacing.control-lg'),
          height: theme('spacing.control-lg'),
        },
      };

      // Player layout utilities
      const playerLayoutUtilities = {
        '.player-controls-container': {
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          padding: theme('spacing.control-padding'),
          zIndex: theme('zIndex.player-controls'),
          display: 'flex',
          flexDirection: 'column',
          gap: theme('spacing.2'),
        },
        '.player-top-controls': {
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          padding: theme('spacing.control-padding'),
          zIndex: theme('zIndex.player-controls'),
          display: 'flex',
          justifyContent: 'space-between',
        },
        '.player-center-controls': {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: theme('zIndex.player-controls'),
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
      };

      // Video thumbnail utilities
      const thumbnailUtilities = {
        '.video-thumbnail-container': {
          position: 'relative',
          overflow: 'hidden',
          borderRadius: theme('borderRadius.lg'),
        },
        '.video-thumbnail': {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
          '.video-thumbnail-container:hover &': {
            transform: 'scale(1.05)',
          },
        },
        '.video-duration-badge': {
          position: 'absolute',
          bottom: theme('spacing.2'),
          right: theme('spacing.2'),
          background: 'rgba(0, 0, 0, 0.8)',
          color: theme('colors.white'),
          fontSize: theme('fontSize.xs'),
          padding: '2px 4px',
          borderRadius: theme('borderRadius.sm'),
          pointerEvents: 'none',
        },
        '.video-play-overlay': {
          position: 'absolute',
          inset: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.3)',
          opacity: '0',
          transition: 'opacity 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
          '.video-thumbnail-container:hover &': {
            opacity: '1',
          },
        },
      };

      // Add all custom components
      addComponents(overlayGradients);
      addComponents(controlVisibility);
      addComponents(timelineComponents);
      addComponents(controlComponents);
      addComponents(playerLayoutUtilities);
      addComponents(thumbnailUtilities);

      // Add responsive utilities for video aspect ratios
      const responsiveAspectRatios = {
        // Responsive wrapper to maintain aspect ratio
        '.aspect-video-container': {
          position: 'relative',
          width: '100%',
          height: '0',
          overflow: 'hidden',
        },
        '.aspect-video-16\\:9': {
          paddingBottom: 'calc(9 / 16 * 100%)',
        },
        '.aspect-video-4\\:3': {
          paddingBottom: 'calc(3 / 4 * 100%)',
        },
        '.aspect-video-21\\:9': {
          paddingBottom: 'calc(9 / 21 * 100%)',
        },
        '.aspect-video-9\\:16': {
          paddingBottom: 'calc(16 / 9 * 100%)',
        },
        '.aspect-video-1\\:1': {
          paddingBottom: '100%',
        },
        '.aspect-video-content': {
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        },
      };

      addUtilities(responsiveAspectRatios);
    }),
    videoPlayerPlugins,
  ],
};
