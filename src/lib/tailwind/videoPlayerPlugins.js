// src/lib/tailwind/videoPlayerPlugins.js
const plugin = require('tailwindcss/plugin');

const videoPlayerPlugins = plugin(function({ addUtilities, matchUtilities, theme }) {
  // Create dynamic transparency utility for controls
  matchUtilities(
    {
      'control-opacity': (value) => ({
        '--control-opacity': value,
        opacity: 'var(--control-opacity)',
      }),
    },
    { values: theme('opacity') }
  );
  
  // Create dynamic backdrop blur for video player overlays
  matchUtilities(
    {
      'overlay-blur': (value) => ({
        '--overlay-blur': `blur(${value})`,
        backdropFilter: 'var(--overlay-blur)',
      }),
    },
    { values: theme('blur') }
  );
  
  // Add utilities for hover states in video player UI
  addUtilities({
    '.hide-on-timeout': {
      'transition': 'opacity 300ms ease-in-out',
      'opacity': '1',
      '&.timed-out': {
        'opacity': '0',
        'pointer-events': 'none',
      },
    },
    
    '.control-transition': {
      'transition': 'transform 150ms ease, opacity 150ms ease, background-color 150ms ease',
    },
    
    '.control-focus-ring': {
      'outline': 'none',
      'position': 'relative',
      '&:focus-visible::after': {
        'content': '""',
        'position': 'absolute',
        'inset': '-2px',
        'border-radius': 'inherit',
        'box-shadow': '0 0 0 2px theme("colors.blue.400")',
        'pointer-events': 'none',
      },
    },
    
    // Shimmer effect for loading states
    '.shimmer': {
      'position': 'relative',
      'overflow': 'hidden',
      '&::after': {
        'content': '""',
        'position': 'absolute',
        'top': '0',
        'right': '0',
        'bottom': '0',
        'left': '0',
        'transform': 'translateX(-100%)',
        'background-image': 'linear-gradient(90deg, rgba(255,255,255,0) 0, rgba(255,255,255,0.2) 20%, rgba(255,255,255,0.5) 60%, rgba(255,255,255,0))',
        'animation': 'shimmer 2s infinite',
      },
    },
    
    // Crossfade transition for switching videos
    '.video-crossfade': {
      'transition': 'opacity 400ms ease',
      '&.crossfade-leave': {
        'opacity': '0',
      },
      '&.crossfade-enter': {
        'opacity': '1',
      },
    },
    
    // Ripple effect for clicks on the video
    '.video-click-ripple': {
      'position': 'absolute',
      'width': '50px',
      'height': '50px',
      'border-radius': '50%',
      'background': 'rgba(255,255,255,0.3)',
      'transform': 'translate(-50%, -50%) scale(0)',
      'animation': 'video-ripple 600ms ease-out forwards',
    },
  });
  
  // Add keyframes for animations
  addUtilities({
    '@keyframes shimmer': {
      '100%': {
        'transform': 'translateX(100%)',
      },
    },
    '@keyframes video-ripple': {
      '0%': {
        'transform': 'translate(-50%, -50%) scale(0)',
        'opacity': '1',
      },
      '100%': {
        'transform': 'translate(-50%, -50%) scale(6)',
        'opacity': '0',
      },
    },
  });
});

module.exports = videoPlayerPlugins;
